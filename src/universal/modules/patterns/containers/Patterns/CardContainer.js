import React, {Component} from 'react';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import Example from '../../components/Example/Example';
import ExampleCode from '../../components/ExampleCode/ExampleCode';
import PropsTable from '../../components/PropsTable/PropsTable';
import Card from 'universal/modules/meeting/components/Card/Card';

const demoUser = {
  name: '@KittyKitterson',
  image: 'https://placekitten.com/g/600/600',
  badge: null, // absent || active || present
  state: 'invited' // invited || not attending || fully present
};

const card = <Card avatar={demoUser} label={demoUser.state} />;
const cardString = '<Card avatar={demoUser} label={demoUser.state} />';
const cardActive = <Card active avatar={demoUser} hasControls label={demoUser.state} />;
const cardActiveString = '<Card active avatar={demoUser} hasControls label={demoUser.state} />';

const cardPropsList = [
  {name: 'active', type: 'bool',
    description: <span>Card has front-and-center styling (otherwise smaller, blurred)</span>
  },
  {name: 'avatar', type: 'object',
    description: <span>Object to include avatar.name, avatar.image, avatar.badge</span>
  },
  {name: 'label', type: 'string',
    description: <span>Text that appears under the avatar image and name</span>
  }
];

// eslint-disable-next-line react/prefer-stateless-function
export default class CardContainer extends Component {
  static propTypes = {
    // Define
  };

  render() {
    return (
      <div>

        <SectionHeader
          heading="Card"
          // eslint-disable-next-line max-len
          description="A card component with avatar, label and optional controls"
        />

        <Example>
          {card}
          {cardActive}
          <ExampleCode>
            {cardString}<br />
            {cardActiveString}
          </ExampleCode>
        </Example>

        <PropsTable propsList={cardPropsList} />

      </div>
    );
  }
}
