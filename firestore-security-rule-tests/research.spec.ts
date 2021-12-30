require('dotenv').config()
import * as testing from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setLogLevel, doc, getDoc } from 'firebase/firestore'

const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;

describe('research_rev20201020', () => {
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

    it('allows READ by all visitors', async () => {
        const unauthedDb = testEnv.unauthenticatedContext().firestore();

        await assertSucceeds(getDoc(doc(unauthedDb, 'research_rev20201020/bar')));
    });
});