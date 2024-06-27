import axios from 'axios';

/**
 * CHANGE TO THIS CODE RIGHT HERE FOR REAL USECASE
 * @param username 
 *
async function testScrape(username: string) {
  try {
    const response = await axios.post('http://localhost:3000/api/scrape', { username });
    console.log('Scrape result:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during scrape test:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received');
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
*/

/**
 * This is only for TESTING!
 * @param usernames 
 */
async function testScrape(...usernames: string[]) {
    for (const username of usernames) {
      try {
        const response = await axios.post('http://localhost:3000/api/scrape', { username });
        console.log(`Scrape result for ${username}:`, JSON.stringify(response.data, null, 2));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`Error during scrape test for ${username}:`, error.message);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
          } else if (error.request) {
            console.error('No response received');
          }
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  }

async function updateAllUsers() {
  try {
    // Fetch all usernames from the database
    const response = await axios.get('http://localhost:3000/api/users');
    const usernames = response.data.usernames;

    // Start a single scraping session for all users
    const scrapeResponse = await axios.post('http://localhost:3000/api/scrape-all', { usernames });
    console.log('All users update result:', JSON.stringify(scrapeResponse.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during all users update:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received');
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Function to run updateAllUsers once a day
function scheduleUpdateAllUsers() {
  updateAllUsers();
  setInterval(updateAllUsers, 24 * 60 * 60 * 1000); // Run every 24 hours
}

