document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(null, function(items) {
        let moodboardsDiv = document.getElementById('moodboards');

        for (let moodboardName in items) {
            let div = document.createElement('div');

            let button = document.createElement('button');
            button.textContent = moodboardName;
            button.onclick = function() {
                let textArea = document.createElement("textarea");
                textArea.value = items[moodboardName].join(', ');
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("URLs copied to clipboard!");
            };
            div.appendChild(button);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this moodboard?')) {
                    chrome.storage.sync.remove(moodboardName, function() {
                        if (chrome.runtime.error) {
                            console.log("Runtime error.");
                        } else {
                            alert("Moodboard deleted!");
                            location.reload();
                        }
                    });
                }
            };
            div.appendChild(deleteButton);

            moodboardsDiv.appendChild(div);
        }

        // Create new moodboard button
        let newMoodboardButton = document.createElement('button');
        newMoodboardButton.textContent = 'Create new Moodboard';
        newMoodboardButton.onclick = function() {
            let name = prompt("Enter the name for the new Moodboard:");
            if (name) {
                chrome.storage.sync.get(name, function(items) {
                    if (!chrome.runtime.error) {
                        if (items[name]) {
                            alert("A moodboard with this name already exists.");
                        } else {
                            // Create a new moodboard in storage
                            let moodboard = {};
                            moodboard[name] = [];
                            chrome.storage.sync.set(moodboard, function() {
                                if (chrome.runtime.error) {
                                    console.log("Runtime error.");
                                } else {
                                    alert("Moodboard created!");
                                    location.reload();
                                }
                            });
                        }
                    }
                });
            }
        };
        document.body.appendChild(newMoodboardButton);

        // Send moodboards to background script
        chrome.runtime.sendMessage({ command: "updateMoodboards", data: items });
    });
});
