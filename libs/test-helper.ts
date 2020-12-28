import { createSandbox, SinonSandbox } from 'sinon';

export const loadSandbox = (beforeEachHandler: (testSandbox: SinonSandbox) => void) => {
  const testSandbox = createSandbox();

  beforeEach(() => {
    beforeEachHandler(testSandbox);
  });

  afterEach(() => {
    testSandbox.restore();
  });
};
