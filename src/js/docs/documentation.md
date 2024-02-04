# Stream Deck Time Tracker plugin <Badge type="warning" text="beta" />

This plugin is designed to help you track time on your projects or tasks directly from your Elgato Stream Deck.

**Note:** This plugin uses the open-source platform [Kimai](https://www.kimai.org/) for time tracking. Kimai can be [self-hosted](https://www.kimai.org/documentation/chapter-on-premise.html) or used as a service, which also offers a [free plan](https://www.kimai.cloud/start-trial).

## Prerequisites

Before you can use the Stream Deck Time Tracker Plugin, you need to have at least one project with one activity set up in Kimai.

## Installation

To install the Stream Deck Time Tracker plugin, follow these steps:

1. Download the [latest release](https://github.com/b263/stream-deck-time-tracker/releases/latest/download/dev.b263.time-tracker.streamDeckPlugin).
2. Double-click the downloaded file to add it to Stream Deck.

## Usage

Once you've installed the plugin, you can start tracking time on your projects. Here's how:

1. Drag the Time Tracker button to your Stream Deck.
2. Click the settings button and enter your Kimai URL and user credentials. Note that not your user password is being used, but the API password. You can set up the API password in your Kimai user profile in the tab "API access".
3. Click on sign in and verify that your status is "logged in".
4. Press "save & close".
5. Select the project and activity, on which you want to track time.

The button will display the time that has been tracked today and on the current time period.

If you use multiple buttons, only one will be active at any given time. So starting one task will automatically stop the previously running one.
