

/**
 * 
 * @author: Ozzy (@meetg0d)
 * Test file to fill the table and initialize the data
 * 
 * 
 */
export interface UserData {
    id: string;
    name: string;
    username: string;
    followers: number;
    avatarUrl: string;
    status: string;
    isMiladyOG?: boolean;
    isRemiliaOfficial?: boolean;
    score: {
      up: number;
      down: number;
    };
  }


  /**
   * Enter DEMO Data here!
   */

export const initialUsers: UserData[] = [
    {
      id: '1',
      name: 'Ozzy',
      username: 'meetg0d',
      followers: 491,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1801311023674085376/9KQO6MbO_400x400.jpg',
      status: 'Approved',
      score: { up: 16, down: 2 }
    },
    {
      id: '2',
      name: '13 (very eepy)',
      username: '131pepe69',
      followers: 2071,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1804536750611546112/opOwC023_400x400.jpg',
      status: 'Approved',
      score: { up: 82, down: 10 }
    },
    {
      id: '3',
      name: 'Loki (cute/acc)',
      username: 'chillgates_',
      followers: 4585,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1752758607928573952/IAhXPtrw_400x400.jpg',
      status: 'Approved',
      score: { up: 0, down: 0 }
    },
    {
      id: '4',
      name: '🪲 Hieronymus 🏴‍☠️ (현아) ⋆𐙚₊˚⊹♡CUTE/ACC♡⊹˚₊𐙚⋆',
      username: 'Nopointproven',
      followers: 5244,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1805587080086458368/9LnCAHqp_400x400.jpg',
      status: 'Approved',
      score: { up: 0, down: 0 }
    },
    {
      id: '5',
      name: 'Wirelyss 👁️‍🗨️💫',
      username: 'wirelyss',
      followers: 13700,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1779650268679778305/b4hBS7xY_400x400.jpg',
      status: 'Approved',
      score: { up: 0, down: 0 }
    },
    {
      id: '6',
      name: '#𝕭𝕽𝕲🪲Buttons 🌺13⋖33🦄',
      username: 'nizeitstyll',
      followers: 1133,
      avatarUrl: 'https://pbs.twimg.com/profile_images/1797398570976370688/cT8PXIVi_400x400.jpg',
      status: 'Approved',
      score: { up: 0, down: 0 }
    },
    {
        id: '7',
        name: 'jeffortless ·ᴗ·',
        username: 'itsGboii',
        followers: 1545,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1804445109188276224/Ai_pux8J_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '8',
        name: 'thelema',
        username: 'networkspirits',
        followers: 7331,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1742596969862713345/QXusS-M__400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '9',
        name: 'Rue',
        username: 'RueAlar',
        followers: 2172,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1802407584218923009/IKdP95TW_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '10',
        name: '💖 Angel Eyes 💖',
        username: 'AngelEyeCrypto',
        followers: 2760,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1780293523629047808/O0cKkFc8_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 },
        isMiladyOG: true,
      },
      {
        id: '11',
        name: 'Pseudo',
        username: 'Pseud0Anon',
        followers: 3577,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1517549694762860552/6CPhguwR_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '12',
        name: 'Charlotte Fang 🪲 Crown Prince ❀ LOVE HEALS 💞',
        username: 'CharlotteFang77',
        followers: 37300,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1769626157203492864/XtnCYWk__400x400.png',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '13',
        name: '(DAD-DAY) arthurt',
        username: 'MiladyStation',
        followers: 6186,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1788351687553388544/8XRscHK9_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '14',
        name: 'Starlin',
        username: 'TokenWaifu',
        followers: 1601,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1773114303081570305/VjVMx9ph_400x400.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '15',
        name: 'sal ౨ৎ',
        username: 'snowingsal',
        followers: 2636,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1804693700284493825/aQ0qK7ed_400x400.jpg',
        status: 'Approved',
        score: { up: 420, down: 0 }
      },
      {
        id: '16',
        name:'☀︎ Sammi Wong ☀︎',
        username: 'thrice_greatest',
        followers: 73918,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1781282419192037376/WmMdJq4e_400x400.jpg',
        status: 'Risk',
        score: { up: 0, down: -1300 }
      },
      {
        id: '17',
        name: 'sebbusan.eth 🪲 (K/acc)',
        username: 'sebbusaneth',
        followers: 518,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1787723229517254656/UWchdHtq.jpg',
        status: 'Approved',
        score: { up: 0, down: 0 }
      },
      {
        id: '18',
        name: 'Socks (holey)',
        username: 'SocksIroned',
        followers: 3378,
        avatarUrl: 'https://pbs.twimg.com/profile_images/1789191568429035520/KsRk2prO_400x400.jpg',
        status: 'Approved',
        score: { up: 1111, down: 111 }
      },



  ];