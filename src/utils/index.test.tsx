import { msToMin, shallowEqual, clip } from './index'

describe('utils/msToMin', () => {
  it('formata 0 ms como 0:00', () => {
    expect(msToMin(0)).toBe('0:00')
  })

  it('formata segundos corretamente', () => {
    expect(msToMin(59_999)).toBe('0:59')
    expect(msToMin(60_000)).toBe('1:00')
    expect(msToMin(61_000)).toBe('1:01')
  })

  it('formata valores grandes corretamente', () => {
    expect(msToMin(3_599_999)).toBe('59:59')
    expect(msToMin(3_600_000)).toBe('60:00')
  })
})

describe('utils/shallowEqual', () => {
  it('retorna true para objetos estritamente iguais', () => {
    const a = { x: 1, y: 2 }
    const b = { x: 1, y: 2 }
    expect(shallowEqual(a, b)).toBe(true)
  })

  it('ordem das chaves não afeta', () => {
    const a = { x: 1, y: 2 }
    const b = { y: 2, x: 1 }
    expect(shallowEqual(a, b)).toBe(true)
  })

  it('retorna false se houver chave extra ou faltando', () => {
    const a = { x: 1 }
    const b = { x: 1, y: 2 }
    expect(shallowEqual(a as any, b as any)).toBe(false)
  })

  it('retorna false quando algum valor difere', () => {
    const a = { x: 1, y: 2 }
    const b = { x: 1, y: 3 }
    expect(shallowEqual(a, b)).toBe(false)
  })

  it('é superficial: objetos aninhados com referências diferentes retornam false', () => {
    const nested = { z: 1 }
    const a = { o: nested }
    const b = { o: { z: 1 } }
    expect(shallowEqual(a, b)).toBe(false)

    const c = { o: nested }
    expect(shallowEqual(a, c)).toBe(true)
  })
})

describe('utils/clip', () => {
  it('retorna string vazia quando input é vazio', () => {
    expect(clip('')).toBe('')
  })

  it('não corta quando tamanho <= max (default 20)', () => {
    expect(clip('hello')).toBe('hello')
    const s = 'exactlytwentychars!!'
    expect(s.length).toBe(20)
    expect(clip(s)).toBe(s)
  })

  it('corta quando maior que max (default 20)', () => {
    const s = 'this string is definitely longer than twenty'
    const out = clip(s)
    expect(out).toBe(s.slice(0, 17) + '...')
    expect(out.length).toBe(20)
  })

  it('respeita max customizado', () => {
    const s = 'ABCDEFGHIJK'
    expect(clip(s, 10)).toBe('ABCDEFG...')
    expect(clip(s, 11)).toBe('ABCDEFGHIJK')
  })

  it('para max muito pequeno, comportamento atual mantém slice + "..."', () => {
    expect(clip('abcdef', 3)).toBe('...')
    expect(clip('abcdef', 2)).toBe('abcde...')
  })
})