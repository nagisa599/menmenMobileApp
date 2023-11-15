/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.generateVisitRanking = functions.https.onRequest(async (req, res) => {
  const visitsRef = admin.firestore().collection("visits");
  const usersRef = admin.firestore().collection("users");
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const snapshot = await visitsRef.where("visitDate", ">=", threeMonthsAgo).get();
  const visitCounts = {};

  snapshot.forEach((doc) => {
    const { userID } = doc.data();
    visitCounts[userID] = (visitCounts[userID] || 0) + 1;
  });

  const sortedVisitCounts = Object.entries(visitCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const userPromises = sortedVisitCounts.map(async ([userID, count]) => {
    const userSnapshot = await usersRef.doc(userID).get();
    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
      return {
        userID,
        name: userData.name,
        visitCount: count,
        imageUrl: userData.imageUrl,
        title: userData.title,
      };
    }
    return null;
  });

  Promise.all(userPromises).then((rankingData) => {
    res.json({ ranking: rankingData });
  });
});