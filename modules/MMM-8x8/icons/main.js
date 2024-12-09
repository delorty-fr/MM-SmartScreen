const fs = require('fs').promises;
const path = require('path');

// Directory containing the JSON files
const sourceDir = './icons';
// Base directory for categorized folders
const targetBaseDir = './categorized';


// Ensure the target base directory exists
fs.mkdir(targetBaseDir, { recursive: true }).catch(err => console.error('Error ensuring base directory:', err));

// Object to store file names and their categories
const categoryMap = {};
// Object to store key-value pairs of filenames (without extensions) and their categories
const fileCategoryMap = {};

(async () => {

    const componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    const rgbToHex = function (r, g, b) {
        return componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    const toHexaArray = function (iconData) {
        return iconData.map(r => r.map(c => rgbToHex(parseInt(c[0] * 255), parseInt(c[1] * 255), parseInt(c[2] * 255))))
    }
    
    try {
        // Read all files in the source directory
        const files = await fs.readdir(sourceDir);

        for (const file of files) {
            const filePath = path.join(sourceDir, file);

            // Ensure it's a JSON file
            if (path.extname(file).toLowerCase() === '.json') {
                try {
                    // Read and parse the JSON file
                    const data = await fs.readFile(filePath, 'utf8');
                    let json = JSON.parse(data);

                    // Determine category
                    let category = json.category_name || '';
                    category = category.toLowerCase()
                    if(category === '' || category === "my" || category === "popular" || category === "recent") {
                        category = "other"
                    }

                    const toHexa = json.body.icons.map(i => toHexaArray(i))
                    json = {
                        ...json,
                        body: {
                            icons: toHexa
                        }
                    }

                    const categoryDir = path.join(targetBaseDir, category);

                    const fileNameWithoutExt = path.basename(file, path.extname(file));
                    // Add to category map
                    if (!categoryMap[category]) {
                        categoryMap[category] = [];
                    }
                    categoryMap[category].push(fileNameWithoutExt);

                    // Add to file-category map
                    fileCategoryMap[fileNameWithoutExt] = category;

                    // Create the category directory if it doesn't exist
                    await fs.mkdir(categoryDir, { recursive: true });

                    const targetPath = path.join(categoryDir, file);
                    fs.writeFile(targetPath, JSON.stringify(json, null, 2), 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing to file', err);
                        } else {
                            console.log('JSON file created or replaced successfully!');
                        }
                    });
                                        
                    console.log(`Copied ${file} to ${categoryDir}`);
                } catch (err) {
                    console.error(`Error processing file ${file}:`, err);
                }
            }
        }

        // Write the category map to a JSON file
        const mapFilePath = path.join(targetBaseDir, 'category_map.json');
        await fs.writeFile(mapFilePath, JSON.stringify(categoryMap, null, 4));
        console.log(`Category map saved to ${mapFilePath}`);

        // Sort file-category map by numeric keys
        const sortedFileCategoryMap = Object.keys(fileCategoryMap)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .reduce((acc, key) => {
                acc[key] = fileCategoryMap[key];
                return acc;
            }, {});

        // Write the sorted file-category map to a JSON file
        const fileCategoryMapPath = path.join(targetBaseDir, 'file_category_map.json');
        await fs.writeFile(fileCategoryMapPath, JSON.stringify(sortedFileCategoryMap, null, 4));
        console.log(`File-category map saved to ${fileCategoryMapPath}`);

    } catch (err) {
        console.error('Error reading source directory or processing files:', err);
    }
})();