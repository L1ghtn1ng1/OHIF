// Extension ID used to reference the custom export-zip extension
const extensionId = 'export-zip';

// Declare the dependencies this mode relies on
const extensionDependencies = {
  '@ohif/extension-default': '^3.0.0',
  '@ohif/extension-cornerstone': '^3.0.0',
  [extensionId]: '0.0.1', // Our custom extension
};

// Factory function to create the mode configuration
function modeFactory() {
  console.log('[export-zip extension] modeFactory called');

  return {
    id: 'zip-export-mode', // Unique mode ID
    routeName: 'ZipExport', // URL route name (e.g., `/viewer/ZipExport`)
    displayName: 'Export ZIP Mode', // Human-readable name shown in the UI
    contexts: ['VIEWER'], // Mode context – viewer mode for image viewing
    extensions: extensionDependencies, // Include all required extensions

    routes: [
      {
        path: 'ZipExport',
        layoutTemplate: () => ({
          id: '@ohif/extension-default.layoutTemplateModule.viewerLayout', // Use default viewer layout
          props: {
            leftPanels: [
              '@ohif/extension-default.panelModule.seriesList', // Series list on the left
            ],
            rightPanels: [
              '@ohif/extension-cornerstone.panelModule.panelMeasurement', // Measurements on the right
            ],
            viewports: [
              {
                namespace: '@ohif/extension-cornerstone.viewportModule.cornerstone', // Cornerstone viewport
                displaySetsToDisplay: ['@ohif/extension-default.sopClassHandlerModule.stack'], // Display stack-based series
              },
            ],

            // Custom toolbar with only export button
            toolbarButtons: ['exportZip'],
          },
        }),
      },
    ],

    // SOP class handlers define what types of DICOM data this mode can handle
    sopClassHandlers: ['@ohif/extension-default.sopClassHandlerModule.stack'],

    // Called when the mode is entered.
    onModeEnter: ({ servicesManager }) => {
      const { toolbarService } = servicesManager.services;

      // Register or update the toolbar section with our export button
      toolbarService.updateSection(toolbarService.sections.primary, ['exportZip']);
    },

    onModeExit: () => {
      // No cleanup needed for this mode currently
    },

    /**
     * Logic to determine whether this mode is valid for a given study or context.
     * Return `{ valid: true }` to always enable the mode.
     */
    isValidMode: () => ({ valid: true }),
  };
}

// Export the mode definition and metadata
export default {
  id: 'zip-export-mode',
  modeFactory,
  extensionDependencies,
};
