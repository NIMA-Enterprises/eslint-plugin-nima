/* Test file for restrict-imports rule
    Refined and stripped of redundant tests
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-12-04

    Tests present: 13
    Invalid tests: 6
    Valid tests: 7
*/

import { Messages, rule } from "@rules/restrict-imports";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("restrict-imports", rule, {
    invalid: [
        // === BASIC RESTRICTION TESTS ===

        // 1. Disallow an import in a specific folder
        {
            code: "import { Route } from 'react-router';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/routes/index.ts",
            options: [
                [
                    {
                        disableImports: ["Route"],
                        folders: ["**/routes"],
                    },
                ],
            ],
        },

        // 2. Disallow an import in a file that matches a file glob
        {
            code: "import { RestrictedComponent } from './components';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/pages/HomePage.tsx",
            options: [
                [
                    {
                        disableImports: ["RestrictedComponent"],
                        files: ["*Page.tsx"],
                        folders: ["**/components/**"],
                    },
                ],
            ],
        },

        // 3. Disallow a default import
        {
            code: "import localStorage from 'local-storage';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/utils/storage.ts",
            options: [
                [
                    {
                        disableImports: ["localStorage"],
                        folders: ["**/utils"],
                    },
                ],
            ],
        },

        // 4. Multiple imports in a disable list
        {
            code: "import { eval, setTimeout, setInterval } from 'timers';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/index.ts",
            options: [
                [
                    {
                        disableImports: ["eval", "setTimeout", "setInterval"],
                    },
                ],
            ],
        },

        // 5. Test multiple options where the first rule matches
        {
            code: "import { dangerousFunction } from './dangerous';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/security/auth.ts",
            options: [
                [
                    {
                        disableImports: ["dangerousFunction"],
                        folders: ["**/security"],
                    },
                    {
                        allowImports: ["dangerousFunction"],
                        folders: ["**/admin"],
                    },
                ],
            ],
        },

        // 6. Disallow Route import except in Page files (the user's use case)
        {
            code: "import { Route } from 'react-router';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        disableImports: ["Route"],
                    },
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 7. Allow-list only: Route is disabled everywhere except in *Page.tsx files
        {
            code: "import { Route } from 'react-router';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 8. Allow-list only: useSearch is disabled everywhere except in **/*Page.tsx files
        {
            code: "import { useSearch } from '@tanstack/react-router';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/Header.tsx",
            options: [
                [
                    {
                        allowImports: ["useSearch"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 9. Disallow Route from react-router only (not from lucide-react)
        {
            code: "import { Route } from 'react-router';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                        from: ["react-router"],
                    },
                ],
            ],
        },

        // 10. Disallow Route from any react-router package (using glob)
        {
            code: "import { Route } from 'react-router-dom';",
            errors: [
                {
                    messageId: Messages.IMPORT_DISALLOWED,
                },
            ],
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                        from: ["react-router*"],
                    },
                ],
            ],
        },
    ],

    valid: [
        // === VALID USAGE TESTS ===

        // 7. Import in a file not matching the folder restriction
        {
            code: "import { Route } from 'react-router';",
            filename: "/src/utils/index.ts",
            options: [
                [
                    {
                        disableImports: ["Route"],
                        folders: ["**/routes"],
                    },
                ],
            ],
        },

        // 8. Folder matches but the file pattern does not
        {
            code: "import { RestrictedComponent } from './components';",
            filename: "/src/components/atoms/Button.tsx",
            options: [
                [
                    {
                        disableImports: ["RestrictedComponent"],
                        files: ["*Page.tsx"],
                        folders: ["**/components/**"],
                    },
                ],
            ],
        },

        // 9. An import that is in an allow list and in the correct location
        {
            code: "import { sharedFunction } from './shared';",
            filename: "/src/shared/utils.ts",
            options: [
                [
                    {
                        disableImports: ["sharedFunction"],
                        folders: ["**/restricted"],
                    },
                    {
                        allowImports: ["sharedFunction"],
                        folders: ["**/shared"],
                    },
                ],
            ],
        },

        // 10. Route import allowed in Page files using only allowImports (the user's use case)
        {
            code: "import { Route } from 'react-router';",
            filename: "/src/pages/HomePage.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 11. Namespace import not in disable list
        {
            code: "import * as Router from 'react-router';",
            filename: "/src/components/App.tsx",
            options: [
                [
                    {
                        disableImports: ["Route"],
                    },
                ],
            ],
        },

        // 12. Multiple named imports where only some are restricted
        {
            code: "import { Link, NavLink } from 'react-router';",
            filename: "/src/components/Navigation.tsx",
            options: [
                [
                    {
                        disableImports: ["Route"],
                    },
                ],
            ],
        },

        // 13. No options configured - rule is disabled
        {
            code: "import { Route } from 'react-router';",
            filename: "/src/index.ts",
            options: [[]],
        },

        // 14. Allow-list only: useSearch is allowed in *Page.tsx files
        {
            code: "import { useSearch } from '@tanstack/react-router';",
            filename: "/src/pages/HomePage.tsx",
            options: [
                [
                    {
                        allowImports: ["useSearch"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 15. Allow-list only: Other imports not in the allow list are not affected
        {
            code: "import { Link } from 'react-router';",
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                    },
                ],
            ],
        },

        // 16. Route from lucide-react is not affected when restricting react-router
        {
            code: "import { Route } from 'lucide-react';",
            filename: "/src/components/Button.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                        from: ["react-router"],
                    },
                ],
            ],
        },

        // 17. Route from react-router is allowed in *Page.tsx files
        {
            code: "import { Route } from 'react-router';",
            filename: "/src/pages/HomePage.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                        from: ["react-router"],
                    },
                ],
            ],
        },

        // 18. Route from react-router-dom is allowed in *Page.tsx files (glob pattern)
        {
            code: "import { Route } from 'react-router-dom';",
            filename: "/src/pages/HomePage.tsx",
            options: [
                [
                    {
                        allowImports: ["Route"],
                        files: ["*Page.tsx"],
                        from: ["react-router*"],
                    },
                ],
            ],
        },
    ],
});
