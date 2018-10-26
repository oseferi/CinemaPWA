
import { Component } from '@angular/core';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent {
  movies: Movie[] = [
    {
      id: 1,
      name: 'Halloween',
      director: 'David Gordon Green',
      description: `It's been 40 years since Laurie Strode survived a vicious attack from crazed killer Michael Myers on Halloween night. Locked up in an institution, Myers manages to escape when his bus transfer goes horribly wrong. Laurie now faces a terrifying showdown when the masked madman returns to Haddonfield, Ill. -- but this time, she's ready for him.`,
      duration: '1h 44m',
      year: 2018,
      rating: '7.4/10',
      avatarUrl: `https://consequenceofsound.files.wordpress.com/2018/09/halloween.jpg?quality=80&w=380&h=380&crop=1`,
      thumbnailUrl: `http://www.gstatic.com/tv/thumb/movieposters/13864607/p13864607_p_v8_aa.jpg`,
      category: { id: 1, name: 'Thriller' }
    },
    {
      id: 2,
      name: 'Venom',
      director: 'Ruben Fleischer',
      description: `Journalist Eddie Brock is trying to take down Carlton Drake, the notorious and brilliant founder of the Life Foundation. While investigating one of Drake's experiments, Eddie's body merges with the alien Venom -- leaving him with superhuman strength and power. Twisted, dark and fueled by rage, Venom tries to control the new and dangerous abilities that Eddie finds so intoxicating.`,
      duration: '2h 20m',
      year: 2018,
      rating: '7/10',
      avatarUrl: `https://www.24sata.hr/media/img/ce/a7/2134df6952136573d1a1.png`,
      thumbnailUrl: `http://www.gstatic.com/tv/thumb/v22vodart/13937884/p13937884_v_v8_aa.jpg`,
      category: { id: 1, name: 'Thriller' }
    }
  ];

  constructor() {}

  public getAvatarUrl = (url: string) => `url(${url})`;
}