import { Skill, Launch, Intent } from 'alexa-annotations';
import { say } from 'alexa-response';
import { ssml } from 'alexa-ssml';
import NASA from './nasa-api';
import ApiConfig from '../config/nasa.config.js';

export class Space {

  constructor(attributes, client = new NASA(ApiConfig)) {
    this.client = client;
  }

  @Launch
  @Intent('AMAZON.HelpIntent')
  launch() {
    return say('Space launched!');
  }

  @Intent('sound')
  sound() {
    return this.client.sound().then(({ title, description, download_url }) => {
      const message = [title, description].filter(Boolean).join('. ');
      return say(
        <speak>
          Here's a sound from space titled, {message}. <audio src={download_url} />
        </speak>
      );
    }).catch(error => {
      console.error('[Space#sound]', JSON.stringify(error, null, 2));
      return say('I couldn\'t find any space sounds. Try again later.');
    });
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Live long and prosper');
  }

}

export default Skill(Space);
