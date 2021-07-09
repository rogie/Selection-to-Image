// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Attach relaunch button to document (command in manifest.json)
figma.root.setRelaunchData({ open: '' });

// Observe the users selections
figma.on("selectionchange", () => {
    if(figma.currentPage.selection.length > 0){

        // Let the plugin window know we are exporting
        figma.ui.postMessage({
          function: "exporting"
        })
        
        // For this example, just use the first object
        let node = figma.currentPage.selection[0]

        // set timeout is kindof a hack to let the postMessage for "exporting"
        // reach the plugin window before Figma starts cranking on exporting 
        setTimeout(() => {
          // Export this node
          node.exportAsync({
              format: "PNG",
              constraint: { 
                  type: "WIDTH", 
                  value: 1000
              }
          }).then(imageData => {

            console.log('Length before: ', imageData.length)

            // Send the image data to the plugin window
            figma.ui.postMessage({
              function: "show-node-export",
              imageData
            })

          }).catch(e => {
            console.log('ERROR exportAsync: ', e)
          })
        },100)
        
    }
})

function getNodeExport(){
  if(figma.currentPage.selection.length > 0){

    // Let the plugin window know we are exporting
    figma.ui.postMessage({
      function: "exporting"
    })
    
    // For this example, just use the first object
    let node = figma.currentPage.selection[0]

    figma.ui.postMessage({
      function: "exporting"
    })

    // set timeout is kindof a hack to let the postMessage for "exporting"
    // reach the plugin window before Figma starts cranking on exporting 
    setTimeout(() => {
      // Export this node
      node.exportAsync({
          format: "PNG",
          constraint: { 
              type: "SCALE", 
              value: 1
          }
      }).then(imageData => {

        // Send the image data to the plugin window
        figma.ui.postMessage({
          function: "download-node-export",
          imageData
        })

      }).catch(e => {
        console.log('ERROR exportAsync: ', e)
      })
    },100)
  }
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.function === 'get-node-export') {
      getNodeExport()
    }
};
