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
 * LighthouseStatisticsController
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
}