require('dotenv').config()
import * as testing from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setLogLevel, doc, getDoc, setDoc } from 'firebase/firestore'

const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;

const DOCUMENT_BASE = `v3_howtos`;

describe(DOCUMENT_BASE, () => {
    let testEnv;
    beforeAll(async () => {

        // Silence expected rules rejections from Firestore SDK. Unexpected rejections
        // will still bubble up and will be thrown as an error (failing the tests).
        setLogLevel('error');

        testEnv = await initializeTestEnvironment({
            projectId: process.env.PROJECT_ID,
            firestore: { rules: readFileSync('../firestore.rules', 'utf8') },
        });
    })

    afterAll(async () => {
        await testEnv.cleanup();
    });

    beforeEach(async () => {
        await testEnv.clearFirestore();
    })

    describe('anonymous users', () => {
        it('allows READ', async () => {
            const unauthedDb = testEnv.unauthenticatedContext().firestore();

            await assertSucceeds(getDoc(doc(unauthedDb, `${DOCUMENT_BASE}/bar`)));
        });

        it('does not allow WRITE', async () => {
            const unauthedDb = testEnv.unauthenticatedContext().firestore();

            await assertFails(setDoc(doc(unauthedDb, `${DOCUMENT_BASE}/bar`), {
                foo: 'bar'
            }));
        });
    });

    describe('authenticated user', () => {
        it('can WRITE', async () => {
            const authedDb = testEnv.authenticatedContext('jasper').firestore();

            await assertSucceeds(setDoc(doc(authedDb, `${DOCUMENT_BASE}/new-document`), {
                foo: 'bar'
            }));
        });

        it.todo('can not modify document created by another user')
        it.todo('can modify document created by current user')
    })

    describe('admin user', () => {
        it.todo('can modify a document created by another user')
    })
});