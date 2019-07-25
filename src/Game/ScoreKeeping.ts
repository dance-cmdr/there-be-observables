import { Observable } from 'rxjs';
import { SpaceCraft } from '../Spacecraft/SpaceCraft';

export const scoreBoard = (
  document: Document,
  spaceCrafts: SpaceCraft[],
  deaths$: Observable<SpaceCraft>,
) => {
  const SCORE_BOARDS = spaceCrafts.map((_, index) => {
    return document.querySelector(`.player-${index} .score`);
  });

  deaths$.subscribe(({ id }) => {
    let message = '';

    SCORE_BOARDS.forEach((scoreBoard, index) => {
      if (index !== id) {
        // @ts-ignore
        scoreBoard.textContent = parseInt(scoreBoard.textContent) + 1;
      }
      message += `${scoreBoard.textContent} : `;
    });

    console.log(message);
  });
};
