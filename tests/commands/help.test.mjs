import { jest } from '@jest/globals';
import help from '../../src/commands/help.mjs';

describe('help.mjs', () => {
  it('replies with help content', async () => {
    const reply = jest.fn();
    const interaction = { locale: 'en-US', reply };
    const getMsgDep = jest.fn().mockReturnValue('Help text!');
    await help(interaction, { getMsgDep });
    expect(getMsgDep).toHaveBeenCalledWith('en-US', 'help', expect.any(String));
    expect(reply).toHaveBeenCalledWith({ content: 'Help text!', flags: 1 << 6 });
  });

  it('logs and replies with error if reply fails', async () => {
    const reply = jest.fn().mockRejectedValue(new Error('fail'));
    const interaction = { locale: 'en-US', reply };
    const getMsgDep = jest.fn().mockReturnValue('Error!');
    const logDep = { error: jest.fn() };
    await help(interaction, { getMsgDep, logDep });
    expect(logDep.error).toHaveBeenCalledWith('Error in /help handler', expect.any(Error));
    // Should attempt to reply again with error message
    expect(getMsgDep).toHaveBeenCalledWith('en-US', 'error', expect.any(String));
  });
});
