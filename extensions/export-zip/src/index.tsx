import { id } from './id';

/**
 * Converts a data URL (base64 image) to a Blob object.
 * This is required for adding binary data (like images) to a ZIP archive.
 */
function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

export default {
  id,

  /**
   * Defines a toolbar module with a single "Export ZIP" button.
   * This button is later referenced in the mode configuration.
   */
  getToolbarModule: () => [
    {
      definitions: {
        exportZip: {
          id: 'exportZip',
          label: 'Export ZIP',
          type: 'command',
          commandName: 'exportZipCommand',
        },
      },
      defaultContext: 'VIEWER',
      toolbarIds: ['top'], // Appears in the top toolbar
    },
  ],

  /**
   * Defines the command that gets executed when the export button is clicked.
   */
  getCommandsModule: ({ servicesManager }: any) => ({
    definitions: {
      exportZipCommand: {
        commandFn: async function () {
          try {
            const {
              viewportGridService,
              displaySetService,
              dicomMetadataStore,
              uiNotificationService,
            } = servicesManager.services;

            // Get active viewport and canvas
            const { activeViewportIndex, viewports } = viewportGridService.getState();
            const activeViewport = viewports[activeViewportIndex];

            if (!activeViewport || !activeViewport.displaySetInstanceUIDs?.length) {
              uiNotificationService?.show({
                title: 'Export Failed',
                message: 'No active viewport with image data found.',
                type: 'error',
              });
              return;
            }

            // Get the DOM element and canvas for the active viewport
            const viewportElement = document.querySelector(
              `[data-viewport-uid="${activeViewport.viewportId}"]`
            );
            const canvas = viewportElement?.querySelector('canvas') as HTMLCanvasElement;

            if (!canvas) {
              uiNotificationService?.show({
                title: 'Export Failed',
                message: 'Could not find viewport canvas.',
                type: 'error',
              });
              return;
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

            // Fetch metadata for the first image instance
            const displaySetInstanceUID = activeViewport.displaySetInstanceUIDs[0];
            const displaySet = displaySetService.getDisplaySetByUID(displaySetInstanceUID);

            if (!displaySet?.instances?.length) {
              throw new Error('No instances found in display set');
            }

            const firstInstance = displaySet.instances[0];
            const instanceMetadata = dicomMetadataStore.getInstance(
              firstInstance.StudyInstanceUID,
              firstInstance.SeriesInstanceUID,
              firstInstance.SOPInstanceUID
            );

            // Prepare metadata object to include in the ZIP
            const metadata = {
              PatientName:
                instanceMetadata?.PatientName?.Alphabetic ||
                instanceMetadata?.PatientName ||
                'Unknown',
              StudyDate: instanceMetadata?.StudyDate || 'Unknown',
              StudyInstanceUID: firstInstance.StudyInstanceUID,
              SeriesInstanceUID: firstInstance.SeriesInstanceUID,
              SOPInstanceUID: firstInstance.SOPInstanceUID,
              exportDate: new Date().toISOString(),
            };

            // Load JSZip and FileSaver dynamically
            const JSZip = (await import('jszip')).default;
            const FileSaver = await import('file-saver');

            // Create ZIP with image and metadata
            const zip = new JSZip();
            zip.file('image.jpg', dataURLtoBlob(dataUrl));
            zip.file('metadata.json', JSON.stringify(metadata, null, 2));

            const content = await zip.generateAsync({ type: 'blob' });
            FileSaver.saveAs(content, 'report.zip');

            uiNotificationService?.show({
              title: 'Export Successful',
              message: 'ZIP file has been downloaded.',
              type: 'success',
            });
          } catch (error) {
            console.error('[export-zip] Export failed:', error);

            const { uiNotificationService } = servicesManager.services;
            uiNotificationService?.show({
              title: 'Export Failed',
              message: error instanceof Error ? error.message : 'An error occurred during export.',
              type: 'error',
            });
          }
        },
        storeContexts: ['viewports', 'displaySets'],
        options: {},
      },
    },
    defaultContext: 'VIEWER',
  }),

  // Return empty modules to prevent OHIF from throwing errors
  getPanelModule: () => [],
  getViewportModule: () => [],
  getLayoutTemplateModule: () => [],
  getSopClassHandlerModule: () => [],
  getHangingProtocolModule: () => [],
  getContextModule: () => [],
  getDataSourcesModule: () => [],
  getUtilityModule: () => [],
  getModesModule: () => [],
};
