# How the darkroom develops a frame

What `ml-dev/filmos/fos_dev.c` does to a Canon RAW frame, step by step, as arithmetic. It is written down
for **Darkrooms**, which has to do the same so the two give the same picture
([#132](https://github.com/HNGSeries/mfilm-canon-film-simulation/issues/132), decided in
[#119](https://github.com/HNGSeries/mfilm-canon-film-simulation/issues/119)): a difference between them can
then only come from one of these steps, and the check at the end says how big it is.

Numbers below are light on a scale where **1.0 is the camera's white level**, unless a step says
otherwise. The code holds them as integers, 4096 for 1.0. Where a detail is only in the code, the
function is named.

## The steps

**1. Black and white level.** A raw sample `s` becomes `(s − black) / (white − black)`.

- `black` is the mean of the masked columns left of the picture in this frame; 2048 if the frame has
  none or the mean is not believable (below 0 or above half the white level).
- `white` is one number per camera: `WHITE_LEVEL` in `fos_dev.c`, which lists every camera's.

**2. The frame's own white balance.** The three colours are multiplied by the balance the camera wrote
into the frame: Canon's maker note, tag `0x4001`, the four 16-bit numbers from index 63: red, green,
green, blue. The multipliers are red/green, 1, blue/green.

- They are used only if the two greens are equal, green is between 512 and 4096, and red and blue are
  each between a quarter of green and eight times it. Otherwise the frame is developed as daylight,
  with the balance that makes the camera matrix's white neutral, and the log says so.
- The film stock adds no balance of its own. Loading a roll put the camera on the film stock's Kelvin
  ([#115](https://github.com/HNGSeries/mfilm-canon-film-simulation/issues/115)).

**3. Where this frame clips.** Each balanced colour is cut at `clip`. `clip` is 1.0 unless the frame
says otherwise: a Canon's samples stop at a raw value that changes with ISO, so the frame's own blown
samples are looked for (`white_row`, `white_pile`, `white_clip`).

- For each of the three colours the brightest raw samples are counted in bins of 8 raw values (at 14
  bits), on two rows in every sixteen. A colour has a pile when its top four bins hold 16 samples or
  more and at least twice what the eight bins under them hold. `clip` is the lowest pile of the three,
  on the scale of step 1.
- With no pile nothing is blown: `clip` is 1.0, or where the brightest samples are if that is higher.
- A `clip` below 0.5 or above 1.5 is not believed, and 1.0 is used.
- If a balance multiplier is below 1, `clip` is multiplied by the least of them, so a blown pixel has
  all three colours at the clip and is neutral.

**4. Camera colour to sRGB.** A 3 × 3 matrix, as in dcraw: take the camera's `XYZ_CAM` (LibRaw's, in
`fos_dev.c`), multiply by sRGB's RGB-to-XYZ, divide each row by its sum, and invert. Each result is cut
to between 0 and `clip`. This is linear sRGB.

**5. The scanner's exposure.** The picture is multiplied by `2^(ev + the film stock's ev)`, and values
above 16 are cut (`stage_key`).

- For a negative film stock, `ev` brings the frame's key to 0.11. The key is the log-average of
  luminance: on the picture at the size of the camera's print (720 × 480), every fourth pixel each way,
  `l = 0.2126 R + 0.7152 G + 0.0722 B` cut at 1.0, `key = exp(mean(ln(l + 0.0001)))`,
  `ev = log2(0.11 / key)`, kept between −2 and +3.5.
- For a slide film stock nothing is measured: `ev` is 1.
- **Held from outside** (the measuring command): the picture is multiplied by `2^E` and nothing else.
  `E` is the whole of it, the film stock's own offset included.

**6. Vignette.** Each pixel is multiplied by `1 − 0.06 x² − 0.06 y²`, with `x` and `y` running from −1 to
1 across the picture.

**7. Glow round highlights (halation).** Where the luminance of step 5's picture is above the film
stock's threshold (`hal_thr`, 0.75 unless the film stock says otherwise), what is above it is gathered
on a grid a quarter of the 720 × 480 print each way, and spread by two passes of [1 2 1] each way
(`stage_glow`). A pixel takes the glow that is over its own share: the grid's value there, less what
the pixel's own luminance (step 5's, at the size being printed, before the vignette) is above the
threshold, and nothing where that comes below zero (`finish_pos`). This is added to the light, times
the film stock's `halation` and its tint (red 1, green 0.28, blue 0.06 unless it says otherwise). So a
highlight is not lit by its own glow: the film stock's table has a highlight's colour already, a large
bright area keeps it, and the glow falls on what lies beside it. A film stock with `halation` 0 has
none.

**8. The film stock's table.** Each colour `x` becomes a Cineon code,
`v = (685 + 300 log10(0.9892 x + 0.0108)) / 1023`, kept between 0 and 1. The three codes are a place in
the film stock's table: `LOOKnn.LUT`, 33 points a side, red changing fastest, three bytes of sRGB a
point, after an 8-byte header. Between points the table is read through the tetrahedron the place falls
in (`lut_apply`), not along the three axes. The place is held to 1/256 of the distance between two
points. The result is the print: sRGB, 8 bits.

**9. Grain.** The grain is drawn as Darkrooms draws it: a draw at every print pixel, spread over the
draws about it (eight, twenty-four or forty-eight of them, by how wide the clump is and whether the
film stock is mono) by the film stock's `grain_size`, and added strongest in the mid tones
(`finish_grain`). `grain_size` is in pixels of the frame's *short side*, so a print w pixels wide
spreads its grain w/3648 as far on a 6D -- half the frame's width, clumps half as wide -- and a clump
narrower than a print pixel is a softer grain rather than none at all (#104, #186). Below the size
Darkrooms' own smallest print comes to -- the sensor's pixels two by two, which is the camera's Large --
the paper cannot resolve the grain: a print pixel covers several clumps and averages them away, so the
strength falls with the print's width (`grain_resolve`). A 320-wide screen print of a portrait frame
carries a fifth of the grain its Large does, which is what that Large shows when it is looked at the
screen print's size; at and above Darkrooms' size nothing of the strength depends on the size, so the
match with Darkrooms is where it was measured. The spread takes
the strength of a draw a pixel off it, and the strength is up by what it takes (`grain_blur`), as
Darkrooms' own normalising does; the noise is strongest in the mid tones, and random, so two
developers' grain never agrees pixel for pixel. Darkrooms and the camera therefore give the same grain
at any size, the clumps as wide as the print's width allows.

The taps are a table, `GRAIN_TAP`, at clumps of 0, 1/32, 2/32 ... 1.5 print pixels: the centre and
the one, the two and the three away, fitted so that the drawn clump's correlation at lags one to six
is Darkrooms'. That profile is not a Gaussian, and it is one self-similar shape at every film stock
and every print size: read at u = lag / clump it is 0.65 at u = 1, 0.24 at 2, 0.09 at 3 and 0.04 at
4, with a tail that runs further than a Gaussian's -- which five taps a pixel apart cannot hold, their
correlation dying at three pixels. Seven hold it to within 0.026 of the correlation, which is inside
the 0.03 the measurement itself scatters by. Below a clump of a fifth of a pixel only the centre is
drawn, and a pixel of the print costs one draw rather than seven: a Large frame, colour, 2736 x 1824,
takes 550 ms on the simulator against 371 with five taps. `graintest` reads the drawn clump's
agreement at one and at two pixels against Darkrooms' profile, for a quarter of a pixel to a pixel and
a half, and the strength as exactly the film stock's at every one.

The lab's grain strength is the film stock's `grain` times 255, drawn once as a normalised normal,
added by a weight that is `l(255-l)/64` over the mid tones, and held at that strength whatever the
print's size (on an HP5 Plus frame: 6.02 levels at 3648, 5.97 at 1824). A draw of the camera's is flat between -1 and 1, whose deviation
is 1/sqrt(3) of that normal's; `GRAIN_GAIN` (sqrt 3) is that and nothing else, so a film stock's
grain is multiplied by nothing between the two chains.

Measured on 2736 x 1824 prints of one frame -- Darkrooms' "half", which is the camera's Large --
against the camera's own development of the same CR2: Darkrooms' grain is its half print less its full
print brought down to half, which holds nothing of the camera's, and the camera's is its grained print
less its bare one. The two strengths agree within 5% (HP5 Plus 400: 7.6 levels against 7.3) and the
tone weight band by band, while the clump's agreement with the pixel beside it was 0.29 against
Darkrooms' 0.66 -- the camera's grain 2.1 times too fine, which is what the clump being read against
the frame's width and spread by a sigma meant as a correlation had come to. Read against the short
side and drawn by these taps it comes out at 0.61 against 0.66 (HP5 Plus 400), 0.62 against 0.66
(CineStill 800T) and 0.60 (Tri-X 400), the remainder being the camera's JPEG at quality 92 against
Darkrooms' 99: on a stock whose grain is as fine as Ektar 100's the quantisation roughens the clump
past Darkrooms' on its own, which is a separate matter from the drawing.

The lab's grain strength is the film stock's `grain` times 255.

The weight's ends are the lab's as well, and measured: over black the lab's grain is a sixth stronger
than `l(255-l)/64` asks, and over the highlights a twentieth to a fifteenth. `GRAIN_W` in `fos_dev.c`
is that curve in 1/256, read off the same blocks.

The same four frames are the check on the whole chain: each developed from its own CR2, by the
simulator, at the size the camera prints (half the sensor, 1824 x 2736), against the lab's print of
it -- the camera's grain is 1.00 of the lab's over the tones, 0.97-1.02 band by band: 1.00-1.04 (HP5
Plus 400), 1.00-1.05 (HPS 800), 0.97-1.07 (Gold 200) and 0.92-0.96 (Ektar 100), the last of which has
2 levels of grain, where the print's quantising is as much of the number as the film's.

**10. The file.** A JPEG at quality 92, colour at half size each way (4:2:0), sRGB.

Steps 1 to 5 and 8 are the colour. They are what #119 means by "the same steps before the table" and
"how each reads the table", and they are what the check below is about. Steps 6, 7 and 9 are the rest of
the look. They sit outside the table, so the two developers have to agree on them as well for the same
picture, but a measured film stock's table does not carry them.

## What a patch the sensor clipped looks like

A colour cut at `clip` in step 3 or 4 does not come out white: the table prints it as a pale colour.
The measuring command has to leave such patches out, so the computer build of the darkroom writes, for
every pixel of the print, whether one of its colours reached `clip` (`FOS_DUMP_CUT`). Darkrooms needs to
be able to say the same for the frames of a reference, or its pictures have to be read with the
darkroom's.

## The check

```sh
make -C ml-dev/filmos/sim out/devtest out/tables/TABLES.txt
python3 ml-dev/films/measure.py darkrooms <folder of Darkrooms' pictures>
```

The folder holds Darkrooms' pictures of `ml-dev/films/sample/SAMPLE.CR2`, developed as people get them,
one for each of the first film stocks, named by film stock: `portra400.jpg`, `gold200.jpg`,
`ektar100.jpg`, `velvia50.jpg`, `cinestill800t.jpg`, `hp5.jpg`, `pro400h.jpg`. The command develops the
same frame with the darkroom at its Large size, reduces both pictures to 30 × 20 blocks of light, and
compares the blocks: plain dE2000, the mean and the worst block.

The provisional limit for "the same picture" is 1 on the mean and 3 at the worst block. For scale, the
darkroom against itself at another size, on the sample with Kodak Gold 200: Large against Medium is 0.34
and 1.67, Large against Small 0.62 and 3.16. So a mean under about 0.3 cannot be asked of two pictures
of different sizes; what is left at that level is grain, the glow's grid and the JPEG.

Darkrooms is closed source. Its pictures are compared here, and only the numbers go back to #132.

## The computer build's switches

`ml-dev/filmos/sim/out/devtest` is `fos_dev.c` built for a computer. Beyond what the camera does, it
reads these from the environment:

| | |
|---|---|
| `FOS_EV` | the scanner's exposure, held: the whole of step 5 |
| `FOS_DUMP_LIN` | the picture after step 4, as a file: three 32-bit integers a pixel, 4096 = 1.0 |
| `FOS_DUMP_CUT` | a byte a pixel, 1 where a colour reached `clip` |
| `FOS_BARE` | no glow and no grain (for the measuring command's made-up film) |
| `FOS_LUT_DIR` | where the tables are |
| `FOS_JPEG`, `FOS_SIZE` | the JPEG the photographer gets, and its size (1 Medium, 2 Large) |
