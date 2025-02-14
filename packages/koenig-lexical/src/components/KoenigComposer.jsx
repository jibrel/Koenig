import React from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import DEFAULT_NODES from '../nodes/DefaultNodes';
import defaultTheme from '../themes/default';
import KoenigComposerContext from '../context/KoenigComposerContext';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function defaultOnError(error) {
    console.error(error); // eslint-disable-line
}

const defaultConfig = {
    namespace: 'KoenigEditor',
    theme: defaultTheme
};

const KoenigComposer = ({
    initialEditorState,
    nodes = [...DEFAULT_NODES],
    onError = defaultOnError,
    fileUploader = {},
    cardConfig = {},
    children
}) => {
    const initialConfig = React.useMemo(() => {
        return Object.assign({}, defaultConfig, {
            nodes,
            editorState: initialEditorState,
            onError
        });
    }, [initialEditorState, nodes, onError]);

    const editorContainerRef = React.useRef(null);

    if (!fileUploader.useFileUpload) {
        fileUploader.useFileUpload = function () {
            console.error('<KoenigComposer> requires a `fileUploader` prop object to be passed containing a `useFileUpload` custom hook'); // eslint-disable-line no-console
            return;
        };
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <KoenigComposerContext.Provider value={{fileUploader, editorContainerRef, cardConfig}}>
                {children}
            </KoenigComposerContext.Provider>
        </LexicalComposer>
    );
};

export default KoenigComposer;
