When installing 3rd party packages typescript will expect a corresponding typing file
You can try to see if one is available via

```
yarn add -D @types/package-name

```

If it is not available you can avoid errors by defining your own file in this folder
It does not need to contain any data (although you can build out the interface if you want)
