import { useApp } from '../context/useApp'

type Dict = Record<string, string>

export const dict: Record<'pt' | 'en', Dict> = {
  pt: {
    'ui.title': 'Spotify',
    'ui.search_artists': 'Buscar por artista',
    'ui.search_albums': 'Filtrar por álbum',
    'ui.retry': 'Tentar novamente',
    'ui.login':'Login com Spotify',
    'ui.logout': 'Sair',
    'ui.headline':'Entre para buscar artistas',
    'ui.redirect':'Você será redirecionado para o Spotify para autorizar o aplicativo',
    'ui.back':'Voltar',
    'artists.title': 'Artistas',
    'artists.empty': 'Sem resultados. Tente outro artista.',
    'artists.error': 'Erro ao buscar artista. Tente novamente',
    'artist.popularity': 'Popularidade',
    'artist.top_tracks': 'Principais músicas',
    'albums.title': 'Álbuns',
    'albums.empty': 'Nenhum álbum nesta página com esse filtro.',
    'tracks.title': 'Faixas',
    'tracks.name':'Nome',
    'tracks.record':'Disco',
    'tracks.length':'Duração',
    'pagination.prev': 'Anterior',
    'pagination.next': 'Próximo',
    'recent.title': 'Tocados recentemente',
    'recent.empty': 'Nada reproduzido recentemente ou sem permissão.',
  },
  en: {
    'ui.title': 'Spotify',
    'ui.search_artists': 'Search by artist',
    'ui.search_albums': 'Filter by album',
    'ui.retry': 'Retry',
    'ui.login':'Login with Spotify',
    'ui.logout': 'Logout',
    'ui.headline':'Sign in to search for artists',
    'ui.redirect':'You will be redirected to Spotify to authorize the app.',
    'ui.back':'Back',
    'artists.title': 'Artists',
    'artists.empty': 'No results. Try another artist.',
    'artists.error': 'Error when search for artist. Try again',
    'artist.popularity': 'Popularity',
    'artist.top_tracks': 'Top tracks',
    'albums.title': 'Albums',
    'albums.empty': 'No albums on this page matching the filter.',
    'tracks.title': 'Tracks',
    'tracks.name':'Name',
    'tracks.record':'Record',
    'tracks.length':'Duration',
    'pagination.prev': 'Prev',
    'pagination.next': 'Next',
    'recent.title': 'Recently played',
    'recent.empty': 'No recent playback or missing permission.',
  },
}

export function useT() {
  const { lang } = useApp()
  return (token: string) => dict[lang][token] ?? token
}
