let moodboards = {};

// Function to update context menus
function updateContextMenus() {
    // Remove all existing context menus first
    chrome.contextMenus.removeAll(function() {
        // Create parent context menu item
        chrome.contextMenus.create({
            "title": "Add to FlowBuddy",
            "contexts": ["image"],
            "id": "parent"
        });
        
        // Create child context menu items for each moodboard
        for (let moodboardName in moodboards) {
            chrome.contextMenus.create({
                "title": moodboardName,
                "parentId": "parent",
                "contexts": ["image"],
                "id": moodboardName
            });
        }
    });
}

chrome.runtime.onInstalled.addListener(function() {
    // Get existing moodboards from storage
    chrome.storage.sync.get(null, function(items) {
        moodboards = items;
        updateContextMenus();
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId in moodboards) {
        // Handle adding images to moodboards
        moodboards[info.menuItemId].push(info.srcUrl);
        chrome.storage.sync.set({[info.menuItemId]: moodboards[info.menuItemId]}, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command == "updateMoodboards") {
        moodboards = request.data;
        updateContextMenus();
    }
});