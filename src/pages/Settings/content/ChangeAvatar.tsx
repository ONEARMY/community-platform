// *** TODO - code taken out of main edit form, to be re-written and included

export class ChangeAvatarComponent {
  render() {
    return (
      <>
        {/* <UploadedFile
                        file={values.avatar}
                        imagePreview
                        showDelete
                        onFileDeleted={form.mutators.clearCoverImage}
                      /> */}

        {/* <Field
                        name="avatar"
                        component={FirebaseFileUploaderField}
                        storagePath={this.uploadPath}
                        hidden={true}
                        accept="image/png, image/jpeg"
                        buttonText="Upload your avatar"
                      /> */}
      </>
    )
  }
}

/*
Old code that will come in handy when putting back in avatar edit. Keeping here for now (Chris)

errors ? (
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key.toString()}>{value}</li>
            ))}
          </ul>
        ) : null}

        mutators={{
          ...arrayMutators,
          clearCoverImage: (args, state, utils) => {
            utils.changeValue(state, 'cover_image', () => null)
          },
        }}


*/
