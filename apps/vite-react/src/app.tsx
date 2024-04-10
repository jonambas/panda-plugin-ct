import './styles.css';
import { css, ct } from '@/styled-system/css';

export const App = () => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        h: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      })}
    >
      <p className={css({ background: ct('semantic.green') })}>
        {ct('semantic.green')}
      </p>
      <p className={css({ background: ct('semantic.red') })}>
        {ct('semantic.red')}
      </p>
      <p className={css({ background: ct('raw.blue') })}>{ct('raw.blue')}</p>
      <p className={css({ background: ct('raw.red') })}>{ct('raw.red')}</p>
      <p className={css({ background: ct('valueKey.object') })}>
        {JSON.stringify(ct('valueKey.object'))}
      </p>
      <p className={css({ background: ct('valueKey.string') })}>
        {ct('valueKey.string')}
      </p>
    </div>
  );
};
