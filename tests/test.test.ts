describe('test suite', () => {
  it('should run', () => {
    expect(1).toBe(1)
  })
  it('should run 2', () => {
    expect(2).not.toBe(1)
  })
  it('should fail', () => {
    expect(1).toBe(2)
  })
})
