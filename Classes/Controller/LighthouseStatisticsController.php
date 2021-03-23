<?php
//declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Controller;

use TYPO3\CMS\Core\Context\Context;
use TYPO3\CMS\Extbase\Mvc\Web\Routing\UriBuilder;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Site\SiteFinder;
use TYPO3\CMS\Core\Site\Entity\SiteLanguage;

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
class LighthouseStatisticsController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{
    public function __construct(){
 
    }
    /**
     * lighthouseStatisticsRepository
     * 
     * @var \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository
     */
    protected $lighthouseStatisticsRepository = null;

    /**
     * UriBuilder
     *
     * @var \TYPO3\CMS\Extbase\Mvc\Web\Routing\UriBuilder
     */
    protected $uriBuilder = NULL;

    /**
     * @param \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository
     */
    public function injectLighthouseStatisticsRepository(\Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository)
    {
        $this->lighthouseStatisticsRepository = $lighthouseStatisticsRepository;
    }

    public function getLangId(){
        $context = GeneralUtility::makeInstance(Context::class);
    
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $site = $GLOBALS['TYPO3_REQUEST']->getAttribute('site');
        $langId = $context->getPropertyFromAspect('language', 'id');#
        return $langId;
    }

    public function getLocale($langId){
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $site = $GLOBALS['TYPO3_REQUEST']->getAttribute('site');
        /** @var TYPO3\CMS\Core\Site\Entity\SiteLanguage */
        $language = $site->getLanguageById($langId);
        $langCode = $language->getLocale();
        return $langCode;
    }


    /**
     * action list
     * 
     * @return string|object|null|void
     */
    public function listAction()
    {
        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findAll();
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics); 
        /* GET URL PARAMS FOR GENERATING LIGHTHOUSE AJAX GET*/
        $langId = $this->getLangId();
        $locale = $this->getLocale($langId);
        \TYPO3\CMS\Core\Utility\DebugUtility::debug($locale); 
        $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $baseUrl = $protocol."/".$_SERVER["HTTP_HOST"];
        $this->view->assign('baseUrl', $baseUrl);
    }

    /**
     * action show
     * 
     * @param \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function showAction(\Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics)
    {
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics);
    }

    /**
     * action delete
     * 
     * @param \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function deleteAction(\Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics)
    {
        $this->addFlashMessage('The object was deleted. Please be aware that this action is publicly accessible unless you implement an access check. See https://docs.typo3.org/typo3cms/extensions/extension_builder/User/Index.html', '', \TYPO3\CMS\Core\Messaging\AbstractMessage::WARNING);
        $this->lighthouseStatisticsRepository->remove($lighthouseStatistics);
        $this->redirect('list');
    }

    private function postlighthouse(){
        $this->url = $this->settings['url'];
        //\TYPO3\CMS\Core\Utility\DebugUtility::debug($this->url);
    }
    /**
     * action analyse
     * 
     * @return string|object|null|void
     */
    public function analyseAction()
    {
        postlighthouse();
    }

    /**
     * action page url
     * 
     * @return string|object|null|void
     */
    /*public function getUrl()
    {
        return $uriBuilder->request->getBaseUrl().$uriBuilder->uriBuilder
            ->reset()
            ->setTargetPageUid(1)
            ->setArguments(self::ABSOLUTE_PATH)
            ->buildFrontendUri();
    }*/
    
}

/*$lighthouse = new LighthouseStatisticsController();
$lighthouse->getUrl();*/

