# Freelancer Cleanup Tools

## Dependencies: 

- [Node.js](https://nodejs.org/en/)

## How to run:

- Clone the repo into your Freelancer folder, alongside the `DATA`, `DLLS` and `EXE` folders.
- In the cloned project folder, run `npm install` on your terminal.
- Run the desired script using the `node` command, for example: `node listUnusedBases`

## Available scripts:

<details><summary>List Unused Bases</summary>
<p>

| File Name | Exclude Option | Export Option |
| --- | --- | --- |
| `listUnusedBases.js` | `--exclude <system names>` | `--E` |
| | Excludes the given systems.<br>Names are separated by space. | Exports the fields into a file<br>named `unusedBases.txt` |

</p>
</details>

<details><summary>List Unused Fields</summary>
<p>

| File Name | Exclude Option | Export Option | Delete Option |
| --- | --- | --- | --- |
| `listUnusedFields.js` | `--exclude <system names>` | `--E` | `--D` |
| | Excludes the given systems.<br>Names are separated by space. | Exports the fields into a file<br>named `unusedFields.txt` | Deletes the unused field files. |

</p>
</details>