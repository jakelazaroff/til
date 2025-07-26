# Change the navigation bar font

I wanted to set a SwiftUI iOS app in [SF Rounded](https://v-fonts.com/fonts/sf-rounded). It's a system font, so I thought it'd be pretty easy. On the web, it would take like two lines of CSS.

Setting the font of the _content_ to SF Rounded was pretty easy — just call the `fontDesign(.rounded)` on the root view:

```swift
@main
struct myApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
        .fontDesign(.rounded)
    }
  }
}
```

Setting the font of the _navigation bar_, though, turned out to be surprisingly hard! I don't think you can actually do it in SwiftUI alone — you need to pull out some UIKit APIs.

I asked on [Bluesky](https://bsky.app/profile/jakelazaroff.com/post/3lun6jp6cx22f) and got some very nice help from [Mark Malstrom](https://malstrom.me). A lot of resources online seem to recommend similar approaches: creating an instance of [`UINavigationBarAppearance`](https://developer.apple.com/documentation/technotes/tn3106-customizing-uinavigationbar-appearance/) and setting `UINavigationBar.appearance().standardAppearance` to that instance:

```swift
@main
struct myApp: App {
  init() {
    guard let descriptor = UIFontDescriptor
      .preferredFontDescriptor(withTextStyle: .headline)
      .withDesign(.rounded) else {
        return
      }

    let appearance = UINavigationBarAppearance()
    appearance.titleTextAttributes = [
      .font: UIFont(descriptor: descriptor, size: 0)
    ]

    UINavigationBar.appearance().standardAppearance = appearance
  }

  var body: some View {
    // ...
  }
}
```

(Some resources will also tell you to set the `compactAppearance` and `scrollEdgeAppearance` properties, but Apple's documentation says that if those are set to `nil` it applies the `standardAppearance` in those cases.)

On the other hand, [some resources](https://stackoverflow.com/a/68418167) recommended mutating `UINavigationBar.appearance()` directly:

```swift
@main
struct myApp: App {
  init() {
    guard let descriptor = UIFontDescriptor
      .preferredFontDescriptor(withTextStyle: .headline)
      .withDesign(.rounded) else {
        return
      }

    UINavigationBar.appearance().titleTextAttributes = [
      .font: UIFont(descriptor: descriptor, size: 0)
    ]
  }

  var body: some View {
    // ...
  }
}
```

The first seems [better documented](https://developer.apple.com/documentation/technotes/tn3106-customizing-uinavigationbar-appearance/), and Claude tells me that the second is a deprecated way of accomplishing it, so I went with that one.
