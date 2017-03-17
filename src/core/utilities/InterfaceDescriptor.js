/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import serverCommunication from './ServerCommunication';
import TextEditor from '../containers/TextEditor';
import Wrapper from '../components/Wrapper';
import SVG from '../components/SVG';
import layoutStyles from '../styles/Layout.css';

// This is the API version for good measure
export const apiVersion = 1.1;

// We expose the server API
export const api = serverCommunication;

// Decorator for connecting external components to the store
export { stateAware } from './StoreManager';

// We export resuable components
export const components = {
    textEditor: TextEditor,
    wrapper: Wrapper,
    svg: SVG
};

// We export redundant styles
export const styles = layoutStyles;
