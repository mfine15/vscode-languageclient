# VSCode Language Server - Client Module

This is a fork of VSCode Language Server that supports clangd's custom Language Server Protocol described in https://reviews.llvm.org/D34947.

To use, create a didOpen middleware that adds metadata to the opened text document.

```typescript
import { MetadataTextDocument } from "vscode-languageclient";

const clientOpts = {
	...
	middleware: {
		didOpen: (document: MetadataTextDocument, next: (document: MetadataTextDocument) => void): void => {
			document = {
				...document,
				metadata: { extraFlags: "-Wall" }
			};
			next(document);
		}
	}
};

new LanguageClient("cpp", "cpp", serverOpts, clientOpts);
```

Sample output:

```
Content-Length: 125

{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"processId":123,"rootPath":"clangd","capabilities":{},"trace":"off"}}
#
Content-Length: 205

{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///foo.c","languageId":"c","version":1,"text":"int main() { int i; return i; }"},"metadata":{"extraFlags":["-Wall"]}}}
# CHECK: {"jsonrpc":"2.0","method":"textDocument/publishDiagnostics","params":{"uri":"file:///foo.c","diagnostics":[{"range":{"start": {"line": 0, "character": 28}, "end": {"line": 0, "character": 28}},"severity":2,"message":"variable 'i' is uninitialized when used here"},{"range":{"start": {"line": 0, "character": 19}, "end": {"line": 0, "character": 19}},"severity":3,"message":"initialize the variable 'i' to silence this warning"}]}}
#
Content-Length: 175

{"jsonrpc":"2.0","method":"textDocument/didChange","params":{"textDocument":{"uri":"file:///foo.c","version":2},"contentChanges":[{"text":"int main() { int i; return i; }"}]}}
# CHECK: {"jsonrpc":"2.0","method":"textDocument/publishDiagnostics","params":{"uri":"file:///foo.c","diagnostics":[{"range":{"start": {"line": 0, "character": 28}, "end": {"line": 0, "character": 28}},"severity":2,"message":"variable 'i' is uninitialized when used here"},{"range":{"start": {"line": 0, "character": 19}, "end": {"line": 0, "character": 19}},"severity":3,"message":"initialize the variable 'i' to silence this warning"}]}}
#
Content-Length: 44

{"jsonrpc":"2.0","id":5,"method":"shutdown"}
```