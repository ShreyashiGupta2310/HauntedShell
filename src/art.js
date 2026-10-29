// Each drawing is one entry in the list. Add a ghost by adding one more.
// Rule: never put a backtick (`) or ${ inside a drawing, because it would
// break the template string it lives in.
export const ghostArts = [
  // classic
  String.raw`
    .-----.
   / o   o \
  |    O    |
  |         |
  |/\/\/\/\/|
`,
  // tall and sleepy
  String.raw`
     ___
    /   \
   | o o |
   |  ^  |
   |     |
   |/\/\/|
`,
  // arms up, boo
  String.raw`
    .--.
   (o  o)
  \|  O |/
   |    |
   |/\/\|
`,
  // wide with a hood
  String.raw`
   .-""""-.
  /  _  _  \
 |  (o)(o)  |
 |    __    |
 |          |
 |/\/\/\/\/\|
`,
  // small and round
  String.raw`
     .-.
    (o o)
    | O |
    |   |
    |/\/|
    '---'
`,
  // faded wisp with dead eyes
  String.raw`
   ~ ~ ~ ~ ~
  ( x     x )
   (   __   )
    |/\/\/\|
`,
];