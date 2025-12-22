import { minimatch } from "minimatch";
import path from "node:path";

export const isFileMatched = ({
    filename,
    files,
    folders,
}: {
    filename: string;
    files: string[];
    folders: string[];
}) => {
    const dir = path.dirname(filename);
    const base = path.basename(filename);

    const hasFolders = folders.length > 0;
    const hasFiles = files.length > 0;

    if (!hasFolders && !hasFiles) {
        return false;
    }

    if (hasFolders && hasFiles) {
        const isFolderMatch = folders.some((f) => minimatch(dir, f));
        const isFileMatch = files.some((f) => minimatch(base, f));
        return isFolderMatch && isFileMatch;
    }

    if (hasFolders && !hasFiles) {
        return folders.some((f) => minimatch(dir, f));
    }

    if (!hasFolders && hasFiles) {
        return files.some((f) => minimatch(base, f));
    }

    return false;
};

export default isFileMatched;
