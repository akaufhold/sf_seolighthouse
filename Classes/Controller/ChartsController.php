<?php
//declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Controller;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Context\Context; 

/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/*------------------------- DEBUG --------------------------*/
/*----------------------------------------------------------*/
/*-     \TYPO3\CMS\Core\Utility\DebugUtility::debug();     -*/
/*----------------------------------------------------------*/

/**
 * ChartsController
 */
class ChartsController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController{
    /**
     * lighthouseStatisticsRepository
     * 
     * @var \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository
     */
    protected $lighthouseStatisticsRepository = null;

    /**
     * @param \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository
     */
    public function injectLighthouseStatisticsRepository(\Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository)
    {
        $this->lighthouseStatisticsRepository = $lighthouseStatisticsRepository;
    }

    public function objectsContainsDevice($lighthouseStatistics)
    {
        foreach($lighthouseStatistics as $entry => $values){
            if ($values->getDevice());
                $this->view->assign($values->getDevice(), "1"); 
        }
    }
    /**
     * charts action
     * 
     * @return string|object|null|void
     */
    public function chartsAction()
    {
        $LighthouseStatisticsController = GeneralUtility::makeInstance(LighthouseStatisticsController::class);
        $this->view->assign('pageId', $LighthouseStatisticsController->getSelectedPage());

        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findLimitedEntries(20, $LighthouseStatisticsController->getSelectedPage());
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics); 

        $this->objectsContainsDevice($lighthouseStatistics);
    }
}