M-Film for the camera (Film OS + Magic Lantern)
================================================
M-Film by HNGSeries, built on Magic Lantern.

What is in here: autoexec.bin, the ML/ folder and ML-SETUP.FIR, for ONE camera model and
ONE Canon firmware version (the zip's name says which, e.g. 650D.104 = EOS 650D, firmware 1.0.4).
The 1300D's zip has no ML-SETUP.FIR: Magic Lantern doesn't make one for it. It has mlinstall instead, in
the folder mlinstall-for-your-computer, which doesn't go on the card. See "1300D" below.
The EOS M2's zip has no ML-SETUP.FIR either: none for the M2 can be traced to Magic Lantern's
developers. See "EOS M2" below.

Testers have tried most cameras now. How far each one got, and what's still wrong, is in the
camera table at https://github.com/HNGSeries/mfilm-canon-film-simulation#cameras
If nobody has tried yours yet, read TESTING.md there before you use it.

Install
  On an EOS M2, read "EOS M2" below first: its steps are different.
  1. Check the camera's Canon firmware (MENU > the last settings tab > Firmware ver.).
     It must be the version in this zip's name. If not, update Canon's firmware first (on the
     1100D, Canon's newest is 1.0.6 and M-Film needs 1.0.5: on 1.0.6, go back to 1.0.5 with
     Canon's 1.0.5 updater first).
  2. Format the card in the camera, then copy everything in this zip to its root. The card's top
     level must show autoexec.bin, ML-SETUP.FIR and the ML folder, not a folder with them inside
     (unzipping often makes one). Without the ML folder there, the update in step 3 stops with
     "ML directory not found!".
  3. Put the card in the camera, MENU > Firmware ver. > update, and follow the screen.
     This sets the camera to start Magic Lantern from the card.
  4. Switch the camera on. The film shelf appears once the camera has started.

1300D
  In step 2, copy everything but the folder mlinstall-for-your-computer. Step 3 is done from a computer
  instead, with mlinstall (by petabyt, GPL-2.0), which is in that folder: its README.txt says which file is
  for Windows, Mac or Linux.
  a. Camera on, connected by USB. In mlinstall, wait until it finds the camera, then Enable Boot Disk
     (Enable Custom Boot in some versions).
  b. Camera off, card in the computer's reader. In mlinstall's card tab, Write card boot flags. This
     needs administrator rights (Windows: Run as administrator; Mac and Linux: sudo), and writes to the
     first card called EOS_DIGITAL it finds: have only that card plugged in.
  c. Card back in the camera, then step 4.
  More, with what to know first: https://github.com/HNGSeries/mfilm-canon-film-simulation/blob/main/TESTING.md#canon-eos-1300d

EOS M2
  Canon's newest firmware for the M2 is 1.0.4, and M-Film needs 1.0.3: stay on 1.0.3, don't update
  to 1.0.4. The zip has no ML-SETUP.FIR, so step 3 can't be done with it: for now it's for M2s that
  already start Magic Lantern from a card. In place of steps 2 and 3:
  a. Copy everything off the card your M2 already starts Magic Lantern from, to keep it. Don't format
     the card: it has to keep its boot flags.
  b. Delete autoexec.bin and the ML folder from the card, then copy everything in this zip to its root.
  c. Card back in the camera, camera on: the film shelf should appear.
  If your M2 has never run Magic Lantern: mlinstall may set it up as on the 1300D, but no one has tried
  it on an M2 yet, and this zip doesn't carry it. If you try, tell us what happened.
  More: https://github.com/HNGSeries/mfilm-canon-film-simulation/blob/main/TESTING.md#canon-eos-m2

Update to a new version
  Don't copy a new version over the old one: files left from before can make the camera misbehave.
  On an EOS M2, don't format the card: follow "EOS M2" above in place of steps 3 and 4.
  1. Finish the roll and develop it (in the camera or with Darkrooms).
  2. Copy your photos off the card (the DCIM folder).
  3. Format the card in the camera, and choose to remove Magic Lantern.
  4. Install the new version as above, Firmware ver. > update included (on the 1300D: Write card
     boot flags in mlinstall again).
  Your settings go back to their defaults.

Develop on your computer: Darkrooms
  The camera develops a roll slowly, at a smaller size. Darkrooms, a separate program for
  Windows and Mac, develops it on your computer from the full RAW, with the same colour tables.
  Plug the camera in (or put its card in a reader) and open it.
  Free: one roll a day (up to 36 frames), every film, full size, with a Google account.
  Darkrooms Full: unlimited rolls and Fast mode, US$14.99 once or US$2.99 a month.
  https://github.com/HNGSeries/Darkrooms-app/releases/latest

If the camera doesn't start (black screen, card light stays on): take the battery out, take the
card out, and the camera starts normally without it. Tell us (see TESTING.md).

If Magic Lantern's own menu shows instead of the film shelf: the film OS is a module
(ML/modules/filmos.mo) that loads once the camera has started, and it didn't load. Its line in
the Modules tab says why. Tell us.

Prints: the darkroom develops Small (the screen's 720 x 480), Medium or Large; it asks when you
start it. Bigger takes longer, and can be zoomed into in the camera. If the screen is very dim
after the camera lost power while developing with the screen dimmed (INFO), switch it on once
more: M-Film puts the brightness back when it starts.

Remove: format the card in the camera, or delete autoexec.bin and ML/. On an EOS M2, don't format
the card (formatting takes its boot flags with it, and this zip can't put them back): delete
autoexec.bin and ML/, then copy back what you copied off the card in step a.
Logs for a bug report: ML/FILMROLL.LOG on the card.

Free software (GPL-2.0, LICENSE.txt; the source is at https://github.com/HNGSeries/mfilm-canon-film-simulation).
Other parts and their licences: THIRD_PARTY.txt. The colour tables of 53 films (in ML/DARKROOM) are adapted
from Pat David's film emulation tables, and those of 9 are derived from spektrafilm by Andrea Volpato
(https://github.com/andreavolpato/spektrafilm; SPEKTRAFILM_LICENSE.txt, SPEKTRAFILM_CHANGELOG.txt). They are
CC BY-SA 4.0, not GPL-2.0.
Buy the developer a coffee: https://buy.stripe.com/7sY14p8d93QE5Ny5M58so02
