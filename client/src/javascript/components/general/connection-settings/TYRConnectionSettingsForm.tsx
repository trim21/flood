import {FC, useState} from 'react';
import {Trans, useLingui} from '@lingui/react';

import {FormGroup, FormRow, FormRowGroup, Textbox} from '@client/ui';

import type {TYRConnectionSettings} from '@shared/schema/ClientConnectionSettings';

export interface TYRConnectionSettingsProps {
  onSettingsChange: (settings: TYRConnectionSettings | null) => void;
}

const TYRConnectionSettingsForm: FC<TYRConnectionSettingsProps> = ({onSettingsChange}: TYRConnectionSettingsProps) => {
  const {i18n} = useLingui();
  const [settings, setSettings] = useState<TYRConnectionSettings>({
    client: 'tyr',
    url: '',
    token: '',
  });

  const handleFormChange = (field: 'url' | 'token', value: string): void => {
    const newSettings: TYRConnectionSettings = {
      ...settings,
      ...{[field]: value},
    };

    // eslint-disable-next-line no-console
    console.log(newSettings);

    onSettingsChange(newSettings);
    setSettings(newSettings);
  };

  return (
    <FormRow>
      <FormGroup>
        <FormRowGroup>
          <FormRow>
            <Textbox
              onChange={(e) => handleFormChange('url', e.target.value)}
              id="url"
              label={<Trans id="connection.settings.tyr.url" />}
              placeholder={i18n._('connection.settings.tyr.url.input.placeholder')}
            />
          </FormRow>

          <FormRow>
            <Textbox
              onChange={(e) => handleFormChange('token', e.target.value)}
              id="token"
              label={<Trans id="connection.settings.tyr.token" />}
            />
          </FormRow>
        </FormRowGroup>
      </FormGroup>
    </FormRow>
  );
};

export default TYRConnectionSettingsForm;
