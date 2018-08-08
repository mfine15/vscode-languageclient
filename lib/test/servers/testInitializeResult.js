/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const main_1 = require("../../../../server/lib/main");
let connection = main_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
let documents = new main_1.TextDocuments();
documents.listen(connection);
connection.onInitialize((params) => {
    assert.equal(params.capabilities.workspace.applyEdit, true);
    assert.equal(params.capabilities.workspace.workspaceEdit.documentChanges, true);
    assert.equal(params.capabilities.textDocument.completion.completionItem.deprecatedSupport, true);
    assert.equal(params.capabilities.textDocument.completion.completionItem.preselectSupport, true);
    let valueSet = params.capabilities.textDocument.completion.completionItemKind.valueSet;
    assert.equal(valueSet[0], 1);
    assert.equal(valueSet[valueSet.length - 1], main_1.CompletionItemKind.TypeParameter);
    console.log(params.capabilities);
    let capabilities = {
        textDocumentSync: documents.syncKind,
        completionProvider: { resolveProvider: true, triggerCharacters: ['"', ':'] },
        hoverProvider: true
    };
    return { capabilities, customResults: { "hello": "world" } };
});
connection.onInitialized(() => {
    connection.sendDiagnostics({ uri: "uri:/test.ts", diagnostics: [] });
});
// Listen on the connection
connection.listen();
