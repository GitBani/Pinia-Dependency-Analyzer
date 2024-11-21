export interface Parser {
    source: string,
    position: number,
}

// * assumes every file being imported contains at most 1 store
export function getAllImportedStores(source: string): string[] {
    const parser: Parser = { source, position: 0 };
    const paths: string[] = [];

    while (!atEnd(parser)) {
        if (!match(parser, 'import')) {
            parser.position++;
            continue;
        }

        // whitespace after 'import'
        skipWhitespace(parser);

        const importBuff: string[] = [];
        // for imports like import { log } from "console";
        if (match(parser, '{')) {
            // condition always skips whitespace before checking
            while (skipWhitespace(parser), !match(parser, '}')) {
                while (!match(parser, ',') && !isWhitespace(parser.source[parser.position]) && !match(parser, '}')) {
                    importBuff.push(parser.source[parser.position++]);
                }
                
                const name = importBuff.join('');
                if (name.startsWith('use') && name.endsWith('Store')) {
                    while (skipWhitespace(parser), !match(parser, '}')) {
                        parser.position++;
                    }
                    break;
                } else {
                    importBuff.length = 0;
                }
            }
            
            if (importBuff.length === 0) {
                continue; // no store import found, skip
            }
        }
        else {
            while (!isWhitespace(parser.source[parser.position])) {
                importBuff.push(parser.source[parser.position++]);
            }

            const name = importBuff.join('')
            if (!name.startsWith('use') || !name.endsWith('Store')) {
                continue; // non-store import, skip
            }
        }

        // whitespace after imported names
        skipWhitespace(parser);

        if (match(parser, 'as')) {
            // whitespace after 'as'
            skipWhitespace(parser);
            // skip alias
            while (!isWhitespace(parser.source[parser.position])) {
                parser.position++;
            }
            // whitespace after alias
            skipWhitespace(parser);
        }

        match(parser, 'from')
        // whitespace after 'from'
        skipWhitespace(parser);

        const fromBuff: string[] = [];
        match(parser, '\'');
        match(parser, '"');
        while (!match(parser, '\'') && !match(parser, '"')) {
            fromBuff.push(parser.source[parser.position++]);
        }

        const path = fromBuff.join('');
        paths.push(path);
    }

    return paths;
}

// todo make comments skipped
function filterOutComments(tokens: string) {
    const filtered = [];
    let position = 0;

    while (position < tokens.length) {
        const curr = tokens[position];
        // if (curr == '//') 
    }
}

// todo remove if comments does not use this
function startsOrEndsWith(haystack: string, needle: string) {
    return haystack.startsWith(needle) || haystack.endsWith(needle);
}

function match(parser: Parser, toMatch: string): boolean {
    if (parser.position + toMatch.length > parser.source.length) return false;

    for (let i = 0; i < toMatch.length; i++) {
        if (parser.source[parser.position + i] !== toMatch[i]) return false;
    }

    parser.position += toMatch.length;
    return true;
}

function atEnd(parser: Parser) {
    return parser.position >= parser.source.length;
}

function skipWhitespace(parser: Parser) {
    while (!atEnd(parser) && isWhitespace(parser.source[parser.position])) {
        parser.position++;
    }
}

function isWhitespace(ch: string): boolean {
    return /\s/.test(ch);
}
