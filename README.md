# CSV 2 Standard Notes

Standard Notes suffers from a lack of import options. This script will convert a CSV file to a JSON file that can be
imported into Standard Notes.

## Usage.

`git clone https://github.com/EpicVoyage/csv2standardnotes.git`
`npm install`

`node ./csv2sn.js <input.csv>`

This will create a file called `input.json`. Open that in a text editor and copy the contents.

In Standard Notes, create a new note.

Choose a note type of "Plain Text".

Paste the contents of `input.json` into the note.

Change the note type to "Spreadsheet". Confirm the conversion.
