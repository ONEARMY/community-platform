The app has been ejected from create-react-app which makes upgrading more difficult.

The current method consists of:

1. Create a new project with create react app, making sure `--typescript` flag specified
2. Manually compare config/\*, package.json, tsconfig for changes
3. Update accordingly
4. Test
5. Fix

Note, currently there should be no explicit changes to

http://russelljanderson.com/updating-create-react-app/
