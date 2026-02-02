# FocusSpace

FocusSpace is a lightweight Chrome Extension designed to solve the problems of tab overload and digital distraction. It enables users to organize their browsing sessions into "Workspaces" and provides a "Focus Mode" that blocks distracting websites to ensure deep work.

It is built using Vanilla JavaScript, HTML, and CSS, fully compliant with Chrome's Manifest V3 standards.

## Features

- **Workspace Management**: Save groups of open tabs as named workspaces and restore them instantly with a single click.
- **Focus Mode**: A built-in timer that strictly blocks access to distracting websites (e.g., social media, video streaming) during active sessions.
- **Custom Block List**: Users can manage their own list of blocked domains directly from the extension interface.
- **Privacy First**: No data collection. All workspaces and preferences are stored locally on the user's device using Chrome Storage.

## Screenshots

| Workspaces View | Focus Mode View |
|:---:|:---:|
| ![Workspaces UI](<img width="360" height="258" alt="Screenshot 2026-02-02 at 10 30 10 PM" src="https://github.com/user-attachments/assets/7739cd33-0ee7-4bfb-bf40-94623f7e930e"/>
) | ![Focus Mode UI](<img width="361" height="600" alt="Screenshot 2026-02-02 at 10 30 24 PM" src="https://github.com/user-attachments/assets/132d3e0f-087d-44d9-95bc-1e5b32952188"/>
) |

## Installation

Since this extension is in development (or if you prefer to run it from source), you can install it manually in Google Chrome using Developer Mode.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/focus-space.git](https://github.com/your-username/focus-space.git)
    ```
    (Or download the ZIP file and extract it to a folder).

2.  **Open Chrome Extensions**
    - Open Google Chrome.
    - Navigate to `chrome://extensions/` in the address bar.

3.  **Enable Developer Mode**
    - Toggle the switch labeled **Developer mode** in the top right corner of the page.

4.  **Load the Extension**
    - Click the **Load unpacked** button in the top left corner.
    - Select the folder where you cloned or extracted the repository.

5.  **Pin to Toolbar**
    - Click the puzzle piece icon in your Chrome toolbar and pin **FocusSpace** for easy access.

## Usage

### Using Workspaces
1.  Open the tabs you need for a specific task (e.g., "Project Research").
2.  Open the extension and navigate to the **Workspaces** tab.
3.  Enter a name for the workspace and click **Save**.
4.  To restore a session later, simply click the **Load** button next to the saved workspace.

### Using Focus Mode
1.  Navigate to the **Focus Mode** tab.
2.  Set your desired duration (in minutes).
3.  Click **Start Focus**.
4.  If you attempt to visit a blocked site (like YouTube or Facebook) during this time, you will be redirected to a blocked page.
5.  To add new sites to the block list, enter the domain URL in the input field and click the **+** button.

## Contributing

Contributions are always welcome! If you have ideas for new features or improvements, feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/NewFeature`)
3.  Commit your Changes (`git commit -m 'Add some NewFeature'`)
4.  Push to the Branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

## Support

If you find this project useful, please consider giving it a **Star** on GitHub! It helps others discover the project.
