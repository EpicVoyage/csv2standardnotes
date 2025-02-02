# CSV 2 Standard Notes

Standard Notes has a bug affecting copy & paste entry of spreadsheet data. This script will convert a CSV file to a
JSON file that can be imported into Standard Notes.

[Related Bug](https://github.com/standardnotes/forum/issues/3393).

## Usage.

```shell
git clone https://github.com/EpicVoyage/csv2standardnotes.git
npm install
node ./csv2sn.js <input.csv>
```

1. This will create a file called `input.json`. Open that in a text editor and copy the contents.

2. In Standard Notes, create a new note.

3. Choose a note type of "Plain Text".

4. Paste the contents of `input.json` into the note.

5. Change the note type to "Spreadsheet". Confirm the conversion.
