/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import SessionManagerHandle from './SessionManager';
import AuthenticatedHandle from './Authenticated';
import NotAuthenticatedHandle from './NotAuthenticated';

export default SessionManagerHandle;
export const SessionManager = SessionManagerHandle;
export const Authenticated = AuthenticatedHandle;
export const NotAuthenticated = NotAuthenticatedHandle;
