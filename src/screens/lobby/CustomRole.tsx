import { useEffect, useState } from 'preact/hooks';
import { t } from '../../i18n';
import { request } from '../../lcu/request';
import { useAction } from '../../ui/useAction';
import { POSITIONS, positionKey } from './format';

const roles = POSITIONS.filter(p => p !== 'FILL');

/** Sala personalizada: uma rota para a missão, sem preferência secundária. */
export function CustomRole({ first }: { first: string }) {
  const valid = (value: string) => roles.some(p => p === value) ? value : 'UNSELECTED';
  const [confirmed, setConfirmed] = useState(valid(first));
  useEffect(() => setConfirmed(valid(first)), [first]);
  const save = useAction(async (role: string) => {
    await request('PUT', '/lol-lobby/v2/lobby/members/localMember/position-preferences', { firstPreference: role, secondPreference: 'UNSELECTED' });
    setConfirmed(role);
  });
  return <select class="rlc-input rlc-custom-role" aria-label={t('customRoleQuest')} title={t('customRoleQuest')} value={confirmed} disabled={save.pending} onChange={e => {
    const role = e.currentTarget.value;
    // O select nativo muda antes da confirmação; restaura até a resposta da LCU.
    e.currentTarget.value = confirmed;
    if (roles.some(p => p === role)) save.run(role);
  }}>
    <option value="UNSELECTED" disabled>{t('customRoleQuest')}</option>
    {roles.map(role => <option key={role} value={role}>{t(positionKey(role)!)}</option>)}
  </select>;
}
