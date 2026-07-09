import { Dropbox } from 'dropbox'
import config from '~/config'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'

export const backupConcerts = (userId: string) => {
  const concerts = concertsProvider(userId).getAll()

  try {
    const dropboxClient = new Dropbox({
      accessToken: config.dropboxAccessToken,
    })

    void dropboxClient.filesUpload({
      path: `/${userId}-concerts.json`,
      contents: Buffer.from(JSON.stringify(concerts), 'utf8'),
      mode: { '.tag': 'overwrite' },
    })
  } catch (error) {
    console.error('Error uploading backup to Dropbox:', error)
  }
}

export const backupFestivals = (userId: string) => {
  const festivals = festivalsProvider(userId).getAll()

  try {
    const dropboxClient = new Dropbox({
      accessToken: config.dropboxAccessToken,
    })

    void dropboxClient.filesUpload({
      path: `/${userId}-festivals.json`,
      contents: Buffer.from(JSON.stringify(festivals), 'utf8'),
      mode: { '.tag': 'overwrite' },
    })
  } catch (error) {
    console.error('Error uploading backup to Dropbox:', error)
  }
}
