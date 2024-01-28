# Send stereo output through specific output channels

This probably works for many audio interfaces, though in this case I'm using it with a [Quad Cortex](https://neuraldsp.com/quad-cortex). When I have my interface hooked up to my computer, I want to route stereo output to the specific output channels that are connected to my speakers.

This works as of Logic Pro 10.8.1.

First, ensure the interface is selected as the output device:

1. Open Settings, either by going through the Logic Pro menu or hitting `⌘,`.
2. Switch to the Audio tab.
3. Select the interface in the Output Device dropdown.

Then, change the output channels:

1. In the Audio tab, select the nested I/O Assignments tab.
2. Within the third level (!) of nested subtabs, select Output.
3. Set the Output dropdown in the Stereo section to the desired outputs.
