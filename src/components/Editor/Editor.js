import React, { Component } from 'react';
import { default as T } from 'prop-types';
import editorLoader from 'utilities/editorLoader';
import Stale from 'components/Stale';
import style from './style.css';

class Editor extends Component {

    static displayName = 'Editor';

    // Typechecking for container's props
    static T = {
        width: T.oneOfType([
            T.string,
            T.number,
        ]),
        height: T.oneOfType([
            T.string,
            T.number,
        ]),
        value: T.string,
        defaultValue: T.string,
        language: T.string,
        theme: T.string,
        options: T.object,
        editorDidMount: T.func,
        editorWillMount: T.func,
        onChange: T.func,
        requireConfig: T.object,
        context: T.object
    };

    // Default props values
    static defaultProps = {
        width: '100%',
        height: '100%',
        value: null,
        defaultValue: '',
        language: 'javascript',
        theme: 'vs-dark',
        options: {
            fontSize: 12,
            // contextmenu: false,
            quickSuggestions: false,
            automaticLayout: true
        },
        editorDidMount: () => { },
        editorWillMount: () => { },
        onChange: () => { },
        requireConfig: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            valid: true
        };
        this.containerElement = undefined;
        this.__current_value = props.value;
    }

    componentDidMount() {
        this.afterViewInit();
    }

    componentDidUpdate(prevProps) {
        const context = this.props.context || window;
        if (this.props.value !== this.__current_value) {
            // Always refer to the latest value
            this.__current_value = this.props.value;
            // Consider the situation of rendering 1+ times before the editor mounted
            if (this.editor) {
                this.__prevent_trigger_change_event = true;
                this.editor.setValue(this.__current_value);
                this.__prevent_trigger_change_event = false;
            }
        }
        if (prevProps.language !== this.props.language) {
            context.monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    editorWillMount(monaco) {
        const { editorWillMount } = this.props;
        editorWillMount(monaco);
    }

    editorDidMount(editor, monaco) {
        this.props.editorDidMount(editor, monaco);
        editor.onDidChangeModelContent((event) => {
            const value = editor.getValue();

            // Always refer to the latest value
            this.__current_value = value;

            // Only invoking when user input changed
            if (!this.__prevent_trigger_change_event) {
                this.props.onChange(value, event);
            }
        });
    }

    afterViewInit() {
        this.disposed = false;
        editorLoader.getPromise().then(() => {
            if (this.disposed)
                return;
            this.initMonaco();
        });
    }

    initMonaco() {
        const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
        const { language, theme, options } = this.props;
        const context = this.props.context || window;
        if (this.containerElement && typeof context.monaco !== 'undefined') {
            // Before initializing monaco editor
            this.editorWillMount(context.monaco);
            this.editor = context.monaco.editor.create(this.containerElement, {
                value,
                language,
                ...options,
            });
            if (theme)
                context.monaco.editor.setTheme(theme);
            // After initializing monaco editor
            this.editorDidMount(this.editor, context.monaco);
        }
    }

    destroyMonaco() {
        if (this.editor !== undefined)
            this.editor.dispose();
        this.disposed = true;
    }

    assignRef = (component) => {
        this.containerElement = component;
    }

    render() {
        if (this.state.valid === false)
            return <Stale />;
        const { width, height } = this.props;
        const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
        const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
        const dimension = {
            width: fixedWidth,
            height: fixedHeight,
        };

        return (
            <div ref={this.assignRef} style={dimension} className={style.editor} />
        );
    }
}

export default Editor;
