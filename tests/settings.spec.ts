import { test } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase';
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix';
import { setDatabasePrefix } from './support/setDatabasePrefix';

test.describe('[Settings]', () => {
    test('[Cancel edit profile without confirmation dialog]', async ({ page, signIn, context }) => {
        // Arrange
        const DB_PREFIX = generateDatabasePrefix()
        await TestDB.seedDB(DB_PREFIX, ['users'])
        await context.addInitScript(setDatabasePrefix, DB_PREFIX)
        await signIn.withEmailAndPassword('settings_member_new@test.com', 'test1234');

        await page.goto('/settings');

        // Act
        await page.getByText('How-to').click();

        await page.waitForURL('/how-to');
    });

    test.skip('[Cancel edit profile and get dialog]', async ({ page, signIn, context }) => {
        // Arrange
        const DB_PREFIX = generateDatabasePrefix()
        await TestDB.seedDB(DB_PREFIX, ['users'])
        await context.addInitScript(setDatabasePrefix, DB_PREFIX)
        await signIn.withEmailAndPassword('settings_member_new@test.com', 'test1234');

        await page.goto('/settings');

        // Act
        await page.locator('[data-cy=username]').fill('Wrong username');
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Are you sure you want to leave?');
            await dialog.accept()
        });

        await page.getByText('How-to').click();
        await page.waitForURL('/how-to');
    });

    test('[Edit a new profile]', async ({ page, signIn, context }) => {
        // Arrange
        const DB_PREFIX = generateDatabasePrefix()
        await TestDB.seedDB(DB_PREFIX, ['users'])
        await context.addInitScript(setDatabasePrefix, DB_PREFIX)
        await signIn.withEmailAndPassword('settings_member_new@test.com', 'test1234')

        // Act
        await page.goto('/settings');

        await page.waitForTimeout(1000 * 5)

        await setInfo({
            username: 'settings_machine_new',
            description: "We're mechanics and our jobs are making machines",
            coverImage: 'images/profile-cover-2.png',
        }, page)
    });
});

const setInfo = async (info, page) => {
    await page.locator('[data-cy=username').fill(info.username)
    await page.locator('[data-cy=info-description').fill(info.description)
    // await page.locator('[data-cy=coverImages-0]').find(':file').attachFile(info.coverImage)
}