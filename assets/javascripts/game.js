//TODO: Night king army++ as defender died
var YTK = YTK || {};

YTK.rpg = (function() {
  var cards = [
      { 
        name  : 'Daenerys',
        army  : 4,
        hp    : 120,
        ap    : 20,
        adjust : 0,
        won   : "Victorious! You have won back the Iron Throne and brought peace to the people of Westeros"
      },
      { 
        name  : 'Jon Snow',
        army  : 3,
        hp    : 90,
        ap    : 30, 
        adjust : 0,
        won   : "Victorious! You fought hard and was able to defeat your enemies and protect the people of the North"
      },
      {
        name  : 'Cersei',
        army  : 5,
        hp    : 150,
        ap    : 15, 
        adjust : 0,
        won   : "Victorious! Through your skillfully plotted actions you have secured your throne as Queen of Seven Kingdoms"
      },
      {
        name  : 'Night King',
        army  : 4,
        hp    : 120,
        ap    : 10, 
        adjust : 0,
        won   : "Victorious! Your army of White Walkers continues to grow as you slay the people of Westeros and now there is no one left to fight against you"
      },
    ],
    defaults = {
      won: "You have won this battle, don't relax! Advance forward toward your next enemy",
      lose: "You were unable to defeat your enemy, your troops have failed and you can no longer fight in the great war"
    },
    tips = [
    'Daenerys forms an alliance with Jon Snow, Jon Snow receives 2 units of extra reinforcement while Cersei and the Night King faces stronger enemies and each looses 1 unit of troops',
    'Jon Snow pledges his loyalty to Daenerys, Daenerys receives 2 extra unit of troops, and their advancement in the north caused the Night King to loose 1 unit of white walkers',
    'Cersei pretends to join Daenerys and Jon on their quest while secretly plotting against them, Daenerys and Jon Snow each looses 1 unit of troops',
    'Convinced by Jon Snow, Daenerys and Cersei both sends out troops to fight the Night King and lost a good amount of people, Daenerys and Cersei each looses an unit of troops',
    ],
    playerInfo = {
      id: 0,
      hp: 0,
      ap: 0,
      won: ''
    },
    defenderInfo = {
      id: 0,
      hp: 0,
      ap: 0,
    },
    $charCards  = $('.card', '.character-select'),
    $enemyCards = $('.card', '.enemy-select'),
    $defenderCard = $('.card', '.defender'),
    $attackBtn = $('.attack-btn'),

  cardLvlUp = function(cardID) {
    $(cardID).find('.fa-angle-double-up').removeClass('hidden');
  },
  cardLvlDown = function(cardID) {
    $(cardID).find('.fa-angle-double-down').removeClass('hidden');
  },
  adjustAllHPs = function(playerID) {
    var cardZero  = cards[0],
        cardOne   = cards[1],
        cardTwo   = cards[2],
        cardThree = cards[3];

    if (playerID == 0) {
      cardOne.adjust = 2;
      cardTwo.adjust = -1;
      cardThree.adjust = -1;

      cardLvlUp('.card-1');
      cardLvlDown('.card-2');
      cardLvlDown('.card-3');
    }
    else if (playerID == 1) {
      cardZero.adjust = 2;
      cardThree.adjust = -1;

      cardLvlUp('.card-0');
      cardLvlDown('.card-3');
    }
    else if (playerID == 2) {
      cardZero.adjust = -1;
      cardOne.adjust = -1;
      cardLvlDown('.card-0');
      cardLvlDown('.card-1');
    }
    else {
      cardZero.adjust = -1;
      cardTwo.adjust = -1;
      cardLvlDown('.card-0');
      cardLvlDown('.card-2');
    }

    // update actual HP
    cardZero.hp   += getHPFromArmy(cardZero.adjust);
    cardOne.hp    += getHPFromArmy(cardOne.adjust);
    cardTwo.hp    += getHPFromArmy(cardTwo.adjust);
    cardThree.hp  += getHPFromArmy(cardThree.adjust);
  },
  hideCharColumns = function() {
    $charCards.closest('.card-col').hide();
  },
  showEnemyCards = function() {
    // $enemyCards.show();
    $enemyCards.removeClass('hidden');
  },
  setPlayerObj = function(dataObj){
    playerInfo.id = dataObj.id;
    playerInfo.hp = dataObj.hp;
    playerInfo.ap = dataObj.ap;
    playerInfo.won = dataObj.won;
  },
  setDefenderObj = function(dataObj) {
    defenderInfo.id = dataObj.id;
    defenderInfo.hp = dataObj.hp;
    defenderInfo.ap = dataObj.ap;
  },
  hideInstruction = function(id) {
    $('.instruction-' + id).addClass('hidden');
  },
  showInstruction = function(id) {
    $('.instruction-' + id).removeClass('hidden');
  }
  selectedChar = function($picked) {
    var cardID  = parseInt($picked.attr('data-id')),
        cardObj = cards[cardID];

    hideInstruction(1);
    showInstruction(2);

    hideCharColumns();

    $picked.closest('.card-col').show();

    setPlayerObj({id: cardID, hp: cardObj.hp, ap: cardObj.ap, won: cardObj.won});

    $('#tips-text', '#tips-alert').html(tips[cardID]);
    setTimeout(function() {
      $('#tips-alert').addClass('show');
    }, 800);

  },
  setEnemies = function(heroID) {
    showEnemyCards();
    $('.card-'+heroID, '.enemy-select').closest('.card-col').hide();
  },
  getStars = function(num, adjust) {
    var retVal = '';

    adjust = adjust || 0;

    num = parseInt(num);

    if (adjust >= 0) {
      for (var i=0; i<num; i++) {
        retVal += '<i class="fa fa-user" aria-hidden="true"></i>';
      }
      for (var i=0; i< adjust; i++) {
        retVal += '<i class="fa fa-user adjust" aria-hidden="true"></i>';
      }
    }
    else {
      adjust = Math.abs(adjust);
      num = num - adjust;
      for (var i=0; i<num; i++) {
        retVal += '<i class="fa fa-user" aria-hidden="true"></i>';
      }
      for (var i=0; i< adjust; i++) {
        retVal += '<i class="fa fa-user minus-adjust" aria-hidden="true"></i>';
      }
    }
    return retVal;
  },
  putArmy = function(totalWhole, totalHalf) {
    var retVal = '';

    totalHalf = totalHalf || 0;

    if (totalWhole >= 0) {
      for (var i=0; i<totalWhole; i++) {
        retVal += '<i class="fa fa-user" aria-hidden="true"></i>';
      }

      for (var i=0; i< totalHalf; i++) {
        retVal += '<i class="fa fa-user-o hurt" aria-hidden="true"></i>';
      }
    }
    return retVal;
  },
  resetDefenderCard = function() {
    $defenderCard.removeClass('card-0');
    $defenderCard.removeClass('card-1');
    $defenderCard.removeClass('card-2');
    $defenderCard.removeClass('card-3');
  },
  setDefender = function(id) {
    $defenderCard = $('.card', '.defender'),
    cardObj = cards[parseInt(id)];

    resetDefenderCard();

    $('#tips-alert').removeClass('show');  

    $defenderCard.addClass('card-' + id);
    $defenderCard.find('.card-title').html(cardObj.name);
    $defenderCard.find('.army-size').html(getStars(cardObj.army, cardObj.adjust));
    $defenderCard.find('.stats').html(cardObj.hp);

    setDefenderObj({id: id, hp: cardObj.hp, ap: cardObj.ap});

    $defenderCard.removeClass('hidden');
    $attackBtn.removeClass('hidden');

    // console.log('defender object', defenderInfo);
  },
  getAvailableEnemies = function() {
    return $('.available', '.enemy-select').length - 1;
  },
  setupEnemyClick = function() {
    $enemyCards.on('click', function() {
      var $this = $(this),
          enemyID = $this.attr('data-id');

      hideInstruction(2);
      $this.closest('.card-col').removeClass('available');
      $this.closest('.card-col').hide();
      setDefender(enemyID);

      $enemyCards.off('click');
    });
  },
  setupCardStats = function($cardArr) {
    $.each($cardArr, function(index) {
      $($cardArr[index]).find('.card-title').html(cards[index]['name']);
      $($cardArr[index]).find('.stats').html(cards[index]['hp']);
    });
  },
  initCharCards = function() {
    setupCardStats($charCards);

    $charCards.on('click', function() {
      var $this = $(this),
          heroID = $(this).attr('data-id');

      $this.addClass('hero');
      selectedChar($this);

      adjustAllHPs(heroID);

      initArmy();

      setupCardStats($enemyCards);

      setEnemies(heroID);

    });
  },
  initArmy = function() {
    for (var i = 0; i < cards.length; i++) {
      var cardObj = cards[i];
      $('.card-' + i).find('.army-size').html(getStars(cardObj['army'], cardObj['adjust']));
    }
  },
  gameWon = function() {
    console.log('you won');
    initEndGameModal(true, function() {
      $('#endGameModal').modal('show')
    });
  },
  gameLose = function() {
    console.log('you lose');
    initEndGameModal(false, function() {
      $('#endGameModal').modal('show')
    }); 
  },
  hideAttackBtn = function() {
    $attackBtn.addClass('hidden');
  },
  isInt = function (n) {
    return n % 1 === 0;
  },
  getHPFromArmy = function(armyNum) {
    return armyNum * 30;
  },
  getArmyFromHP = function(amtHP) {
    return amtHP / 30;
  },
  adjustHP = function(targetObj, deductAmt) {
    var newArmyAmt;

    // adjust .hp
    targetObj.hp -= deductAmt;

    // translate to people
    newArmyAmt = getArmyFromHP(targetObj.hp);

    if (isInt(newArmyAmt)) {
      return putArmy(parseInt(newArmyAmt));
    }
    else {
      return putArmy(Math.floor(parseInt(newArmyAmt)), 1);
    }
  },
  updateArmySize = function($card, htmlContent) {
    $card.find('.army-size').html(htmlContent);
  },
  isDead = function ($obj) {
    return $obj.hp <= 0;
  },
  setupAttackBtn = function() {
    $attackBtn.on('click', function() {
      var heroArmy = adjustHP(playerInfo, defenderInfo.ap)
          defenderArmy = adjustHP(defenderInfo, playerInfo.ap),
          $heroCard = $('.hero.card');

      playerInfo.ap = playerInfo.ap * 2;

      updateArmySize($defenderCard, defenderArmy);
      updateArmySize($heroCard, heroArmy);

      if (isDead(playerInfo) && isDead(defenderInfo)) {
        showInstruction(2);
        hideAttackBtn();
        gameLose();
      }
      else if (isDead(defenderInfo)) {
        $defenderCard.addClass('hidden');
        showInstruction(2);
        hideAttackBtn();
        gameWon();

        if (getAvailableEnemies() > 0) {
          setupEnemyClick();  
        }
      }
      else if (isDead(playerInfo)) {
        hideAttackBtn();
        gameLose();
      }
    });
  },
  initEndGameModal = function(hasWon, callback) {
    if (hasWon) {
      $('.modal-title', '#endGameModal').html('You Won!');
      $('.ending-picture').addClass('card-' + playerInfo.id);

      if (getAvailableEnemies() > 0) {
        $('#end-speech').html(defaults.won);
        setupPlayAgainBtn(true);
      }
      else {
        $('#end-speech').html(playerInfo.won);
        setupPlayAgainBtn(false);
      }
    }
    else {
      $('.modal-title', '#endGameModal').html('Game Over!');
      $('.ending-picture').addClass('lose');
      $('#end-speech').html(defaults.lose);
      setupPlayAgainBtn(false);
    }
    callback();
  },
  setupPlayAgainBtn = function(isContinue) {
    if (isContinue) {
      $('.play-again', '#endGameModal').html('Continue');
      $('.play-again', '#endGameModal').on('click', function() {
        $('#endGameModal').modal('hide');
      });  
    }
    else {
      $('.play-again', '#endGameModal').html('Play Again');
      $('.play-again', '#endGameModal').on('click', function() {
      window.location.href = "index.html";
    });  
    }
    
  },
  bindShareBtn = function () {
    $('.btn-fb-share').on('click', function() {
      window.location.href = "https://www.facebook.com/sharer/sharer.php?u=https://yankwong.github.io/week-4-game/";
    })
  }
  initPage = function() {
    initCharCards();
    setupCardStats($enemyCards);
    setupEnemyClick();
    initArmy();
    setupAttackBtn();
    bindShareBtn();
  };

return {
    initPage : initPage
  }
})();

$(function() {
  YTK.rpg.initPage();
});