import 'cypress-file-upload'
import { Firestore, Auth } from './db/firebase'
import FileData = Cypress.FileData

export enum UserMenuItem {
  Profile = 'Profile',
  Settings = 'Settings',
  LogOut = 'Logout',
}

declare global {
  namespace Cypress {
    // tslint:disable-next-line:interface-name
    interface Chainable {
      login(
        username: string,
        password: string,
      ): Promise<firebase.auth.UserCredential>

      logout(): Chainable<void>

      deleteDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Promise<void>

      updateDocument(
        collectionName: string,
        docId: string,
        docData: any,
      ): Promise<void>

      queryDocuments(
        collectionName: string,
        fieldPath: string,
        opStr: any,
        value: string,
      ): Chainable<any>

      step(message: string)

      uploadFiles(filePath: string | string[])

      toggleUserMenuOn(): Chainable<void>
      toggleUserMenuOff(): Chainable<void>

      /**
       * Trigger form validation
       */
      screenClick(): Chainable<void>

      clickMenuItem(menuItem: UserMenuItem): Chainable<void>
    }
  }
}

const attachCustomCommands = Cypress => {
  let currentUser: null | firebase.User = null
  const firestore = Firestore

  Auth.onAuthStateChanged(user => {
    currentUser = user
  })

  /**
   * Login and logout commands use the sytem interface to log a user in or out
   * @remark - we tried directly hooking into afauth, however this appeared to be less
   * reliable as execution could take place too fast for platform to keep up with.
   * It also highlighted additional navigation that could take place during login sequence
   */
  Cypress.Commands.add('login', (email, password) => {
    Cypress.log({
      displayName: 'login',
      consoleProps: () => {
        return { email, password }
      },
    })
    if (!currentUser) {
      cy.get('[data-cy=login]').click()
      cy.get('[data-cy=email]')
        .clear()
        .type('howto_reader@test.com')
      cy.get('[data-cy=password]')
        .clear()
        .type('test1234')
      cy.get('[data-cy=submit')
        .should('not.be.disabled')
        .click()
      cy.get('[data-cy=user-menu]', { timeout: 10000 }).should('exist')
    }
  })

  Cypress.Commands.add('logout', () => {
    const userInfo = currentUser ? currentUser.email : 'Not login yet - Skipped'
    Cypress.log({
      displayName: 'logout',
      consoleProps: () => {
        return { currentUser: userInfo }
      },
    })
    if (currentUser) {
      cy.get('[data-cy=user-menu]').click()
      cy.get('[data-cy=menu-Logout]').click()
      cy.get('[data-cy=login]').should('exist')
    }
  })

  Cypress.Commands.add(
    'queryDocuments',
    (collectionName: string, fieldPath: string, opStr: any, value: string) => {
      Cypress.log({
        displayName: 'queryDocuments',
        consoleProps: () => {
          return { collectionName, fieldPath, opStr, value }
        },
      })
      return firestore.queryDocuments(collectionName, fieldPath, opStr, value)
    },
  )

  Cypress.Commands.add(
    'deleteDocuments',
    (collectionName: string, fieldPath: string, opStr: any, value: string) => {
      Cypress.log({
        displayName: 'deleteDocuments',
        consoleProps: () => {
          return { collectionName, fieldPath, opStr, value }
        },
      })
      return firestore.deleteDocuments(collectionName, fieldPath, opStr, value)
    },
  )

  Cypress.Commands.add(
    'updateDocument',
    (collectionName: string, docId: string, docData: any) => {
      Cypress.log({
        displayName: 'updateDocument',
        consoleProps: () => {
          return { collectionName, docId, docData }
        },
      })
      return firestore.updateDocument(collectionName, docId, docData)
    },
  )

  Cypress.Commands.add('step', (message: string) => {
    Cypress.log({
      displayName: 'step',
      message: `**${message}**`,
    })
  })

  const resolveMimeType = (filePath: string) => {
    const mimeTypeMapping = [['.jpg', 'image/jpg'], ['.png', 'image/png']]
    const [_, mimeType]: any = mimeTypeMapping.find(([ext]) =>
      filePath.endsWith(ext),
    )
    if (!mimeType) {
      throw new Error(`Please define the mime type for ${filePath} here!`)
    }
    return mimeType
  }
  Cypress.Commands.add(
    'uploadFiles',
    { prevSubject: 'element' },
    ($inputElement, filePath: string | string[]) => {
      const filePaths: string[] = []
      if (typeof filePath === 'string') {
        filePaths.push(filePath)
      } else {
        filePaths.push(...filePath)
      }
      const getContentReqs = filePaths.map(path => {
        return new Cypress.Promise(resolve => {
          return cy.fixture(path).then(fileContent => {
            resolve({
              fileName: path,
              mimeType: resolveMimeType(path),
              fileContent,
            })
          })
        })
      })

      Cypress.Promise.all(getContentReqs).then((fileData: FileData[]) => {
        cy.wrap($inputElement).upload(fileData)
      })
    },
  )

  Cypress.Commands.add('toggleUserMenuOn', () => {
    Cypress.log({ displayName: 'OPEN_USER_MENU' })
    cy.get('[data-cy=user-menu]').should('be.exist')
    cy.get('[data-cy=user-menu]').click()
  })

  Cypress.Commands.add('toggleUserMenuOff', () => {
    Cypress.log({ displayName: 'CLOSE_USER_MENU' })
    cy.get('[data-cy=header]').click({ force: true })
  })

  Cypress.Commands.add('clickMenuItem', (menuItem: UserMenuItem) => {
    Cypress.log({
      displayName: 'CLICK_MENU_ITEM',
      consoleProps: () => {
        return { menuItem }
      },
    })
    cy.toggleUserMenuOn()
    cy.get(`[data-cy=menu-${menuItem}]`).click()
  })

  Cypress.Commands.add('screenClick', () => {
    cy.get('[data-cy=header]').click({ force: true })
  })
}

attachCustomCommands(Cypress)
