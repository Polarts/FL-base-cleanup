# Freelancer Maintenance Scripts

## Dependencies: 

- [Node.js](https://nodejs.org/en/)

## How to run:

- Clone the repo into your Freelancer folder, alongside the `DATA`, `DLLS` and `EXE` folders.
- In the cloned project folder, run `npm install` on your terminal.
- Run the desired script using the `node` command, for example: `node listUnusedBases`

## Available scripts:

<details><summary>Common Options</summary>
<blockquote>

| Name | Usage | Explanation | Example |
| --- | --- | --- | --- |
| <b>Exclude Systems</b> | `--exclude <system names>` | Excludes the given systems. Names are separated by space. | `node listUnusedFields --exclude br01 br02 br03` |
| <b>Export To File</b> | `--E` | Exports the fields into a file in the output folder. The name of the file is mentioned when the script finishes. | `node listUnusedBases --E` |

</blockquote>
</details>

<details><summary>List Unused Bases</summary>
<blockquote>

<b>File Name:</b> `listUnusedBases.js`

<b>Extra Options:</b> N/A

<b>Example:</b> `node listUnusedBases`

</blockquote>
</details>

<details><summary>List Unused Fields</summary>
<blockquote>

<b>File Name:</b> `listUnusedFields.js`

<b>Extra Options:</b> 

| Option | Explanation |
| --- | --- |
| `--D` | Replaces the unused field files content with a `;` |

<b>Example:</b> `node listUnusedFields`
</blockquote>
</details>

<details><summary>List Invisible Bases</summary>
<blockquote>

<b>File Name:</b> `listInvisibleBases.js`

<b>Extra Options:</b> N/A

<b>Example:</b> `node listInvisaibleBases`
</blockquote>
</details>


<details><summary>List Missing Files</summary>
<blockquote>

<b>File Name:</b> `listMissingFiles.js`

<b>Extra Options:</b> N/A

<b>Example:</b> `node listMissingFiles`
</blockquote>
</details>
