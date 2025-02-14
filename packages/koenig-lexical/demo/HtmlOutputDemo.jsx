import React from 'react';
import {KoenigComposer, KoenigComposableEditor, HtmlOutputPlugin} from '../src';
import FloatingButton from './components/FloatingButton';
import {useState} from 'react';
import Watermark from './components/Watermark';
import {useFileUpload, fileTypes} from './utils/useFileUpload';
import Sidebar from './components/Sidebar';
import {defaultHeaders as defaultUnsplashHeaders} from './utils/unsplashConfig';
import {$getRoot, $isDecoratorNode} from 'lexical';

const cardConfig = {
    unsplash: {defaultHeaders: defaultUnsplashHeaders}
};

function HtmlOutputDemo() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [html, setHtml] = useState('<p><span>check</span> <a href="https://ghost.org/changelog/markdown/" dir="ltr"><span data-lexical-text="true">ghost.org/changelog/markdown/</span></a></p>');
    const [sidebarView, setSidebarView] = useState('json');
    const [defaultContent] = useState(undefined);
    const [editorAPI, setEditorAPI] = useState(null);
    const titleRef = React.useRef(null);
    const containerRef = React.useRef(null);

    function openSidebar(view = 'json') {
        if (isSidebarOpen && sidebarView === view) {
            return setIsSidebarOpen(false);
        }
        setSidebarView(view);
        setIsSidebarOpen(true);
    }

    function focusTitle() {
        titleRef.current?.focus();
    }

    function focusEditor(event) {
        const clickedOnDecorator = (event.target.closest('[data-lexical-decorator]') !== null) || event.target.hasAttribute('data-lexical-decorator');
        const clickedOnSlashMenu = (event.target.closest('[data-kg-slash-menu]') !== null) || event.target.hasAttribute('data-kg-slash-menu');

        if (editorAPI && !clickedOnDecorator && !clickedOnSlashMenu) {
            let editor = editorAPI.editorInstance;
            let {bottom} = editor._rootElement.getBoundingClientRect();

            // if a mousedown and subsequent mouseup occurs below the editor
            // canvas, focus the editor and put the cursor at the end of the document
            if (event.pageY > bottom && event.clientY > bottom) {
                event.preventDefault();

                // we should always have a visible cursor when focusing
                // at the bottom so create an empty paragraph if last
                // section is a card
                let addLastParagraph = false;

                editor.getEditorState().read(() => {
                    const lastNode = $getRoot().getChildren().at(-1);

                    if ($isDecoratorNode(lastNode)) {
                        addLastParagraph = true;
                    }
                });

                if (addLastParagraph) {
                    editorAPI.insertParagraphAtBottom();
                }

                // Focus the editor
                editorAPI.focusEditor({position: 'bottom'});

                //scroll to the bottom of the container
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    }

    return (
        <>
            <div data-testid="html-output" hidden>{html}</div>
            <div
                className="koenig-lexical top"
            >
                <KoenigComposer
                    initialEditorState={defaultContent}
                    fileUploader={{useFileUpload, fileTypes}}
                    cardConfig={cardConfig}
                >
                    <div className="relative h-full grow">
                        <div className="h-full overflow-auto" ref={containerRef} onClick={focusEditor}>
                            <div className="mx-auto max-w-[740px] py-[15vmin] px-6 lg:px-0">
                                <KoenigComposableEditor
                                    registerAPI={setEditorAPI}
                                    cursorDidExitAtTop={focusTitle}
                                >
                                    <HtmlOutputPlugin html={html} setHtml={setHtml}/>
                                </KoenigComposableEditor>
                            </div>
                        </div>
                    </div>
                    <Watermark />
                    <div className="absolute z-20 flex h-full flex-col items-end sm:relative">
                        <Sidebar isOpen={isSidebarOpen} view={sidebarView} />
                        <FloatingButton isOpen={isSidebarOpen} onClick={openSidebar} />
                    </div>
                </KoenigComposer>
            </div>
        </>
    );
}

export default HtmlOutputDemo;
